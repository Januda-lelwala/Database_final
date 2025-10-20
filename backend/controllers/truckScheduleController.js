const { Op } = require('sequelize');
const db = require('../models');
const { listPendingTasks, completeTask } = require('../utils/truckTaskStore');

const {
  TruckSchedule,
  TruckRoute,
  Truck,
  Driver,
  Assistant,
  Order
} = db;

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const generateTruckScheduleId = async () => {
  const count = await TruckSchedule.count();
  return `TS${String(count + 1).padStart(3, '0')}`;
};

const findConflicts = async (column, value, start, end, excludeId) => {
  if (!value) return [];
  const where = {
    [Op.and]: [
      { [column]: value },
      { start_time: { [Op.lt]: end } },
      { end_time: { [Op.gt]: start } }
    ]
  };

  if (excludeId) {
    where[Op.and].push({ truck_schedule_id: { [Op.ne]: excludeId } });
  }

  const conflicts = await TruckSchedule.findAll({
    where,
    attributes: ['truck_schedule_id', 'route_id', 'truck_id', 'driver_id', 'assistant_id', 'start_time', 'end_time'],
    order: [['start_time', 'ASC']]
  });

  return conflicts.map(conflict => conflict.toJSON());
};

const checkResourceAvailable = async (column, value, start, end, excludeId) => {
  const conflicts = await findConflicts(column, value, start, end, excludeId);
  return {
    available: conflicts.length === 0,
    conflicts
  };
};

const includeRelations = [
  {
    model: TruckRoute,
    as: 'route',
    attributes: ['route_id', 'route_name', 'store_id']
  },
  {
    model: Truck,
    as: 'truck',
    attributes: ['truck_id', 'license_plate', 'capacity']
  },
  {
    model: Driver,
    as: 'driver',
    attributes: ['driver_id', 'name']
  },
  {
    model: Assistant,
    as: 'assistant',
    attributes: ['assistant_id', 'name']
  }
];

const getTruckSchedules = async (req, res) => {
  try {
    const { route_id, truck_id, driver_id, assistant_id, from, to } = req.query;

    const where = {};
    const andConditions = [];

    if (route_id) where.route_id = route_id;
    if (truck_id) where.truck_id = truck_id;
    if (driver_id) where.driver_id = driver_id;
    if (assistant_id) where.assistant_id = assistant_id;

    const fromDate = parseDate(from);
    if (from && !fromDate) {
      return res.status(400).json({
        success: false,
        message: 'Invalid "from" date.'
      });
    }

    const toDate = parseDate(to);
    if (to && !toDate) {
      return res.status(400).json({
        success: false,
        message: 'Invalid "to" date.'
      });
    }

    if (fromDate) {
      andConditions.push({ end_time: { [Op.gte]: fromDate } });
    }

    if (toDate) {
      andConditions.push({ start_time: { [Op.lte]: toDate } });
    }

    if (andConditions.length) {
      where[Op.and] = andConditions;
    }

    const schedules = await TruckSchedule.findAll({
      where: Object.keys(where).length ? where : undefined,
      include: includeRelations,
      order: [['start_time', 'ASC']]
    });

    const scheduleData = schedules.map(schedule => schedule.toJSON());

    return res.status(200).json({
      success: true,
      count: scheduleData.length,
      data: { schedules: scheduleData }
    });
  } catch (error) {
    console.error('[truckScheduleController.getTruckSchedules] failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching truck schedules',
      error: error.message
    });
  }
};

const getPendingTruckTasks = async (_req, res) => {
  try {
    const tasks = listPendingTasks();
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: { tasks }
    });
  } catch (error) {
    console.error('[truckScheduleController.getPendingTruckTasks] failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching pending truck tasks',
      error: error.message
    });
  }
};

const createTruckSchedule = async (req, res) => {
  try {
    const {
      truck_schedule_id,
      route_id,
      truck_id,
      driver_id,
      assistant_id,
      start_time,
      end_time,
      order_id
    } = req.body;

    if (!route_id || !truck_id || !driver_id || !assistant_id || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'Route, truck, driver, assistant, start time, and end time are required.'
      });
    }

    const start = parseDate(start_time);
    const end = parseDate(end_time);

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start or end time.'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time.'
      });
    }

    const [route, truck, driver, assistant] = await Promise.all([
      TruckRoute.findByPk(route_id),
      Truck.findByPk(truck_id),
      Driver.findByPk(driver_id),
      Assistant.findByPk(assistant_id)
    ]);

    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found.' });
    }
    if (!truck) {
      return res.status(404).json({ success: false, message: 'Truck not found.' });
    }
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found.' });
    }
    if (!assistant) {
      return res.status(404).json({ success: false, message: 'Assistant not found.' });
    }

    if (truck_schedule_id) {
      const existing = await TruckSchedule.findByPk(truck_schedule_id);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Truck schedule ID already exists.'
        });
      }
    }

    const [truckAvailability, driverAvailability, assistantAvailability] = await Promise.all([
      checkResourceAvailable('truck_id', truck_id, start, end),
      checkResourceAvailable('driver_id', driver_id, start, end),
      checkResourceAvailable('assistant_id', assistant_id, start, end)
    ]);

    const conflicts = [];

    if (!truckAvailability.available) {
      conflicts.push({
        type: 'truck',
        schedule_ids: truckAvailability.conflicts.map(c => c.truck_schedule_id)
      });
    }
    if (!driverAvailability.available) {
      conflicts.push({
        type: 'driver',
        schedule_ids: driverAvailability.conflicts.map(c => c.truck_schedule_id)
      });
    }
    if (!assistantAvailability.available) {
      conflicts.push({
        type: 'assistant',
        schedule_ids: assistantAvailability.conflicts.map(c => c.truck_schedule_id)
      });
    }

    if (conflicts.length) {
      return res.status(409).json({
        success: false,
        message: 'One or more resources are already scheduled during this time window.',
        data: { conflicts }
      });
    }

    const scheduleId = truck_schedule_id || await generateTruckScheduleId();

    const newSchedule = await TruckSchedule.create({
      truck_schedule_id: scheduleId,
      route_id,
      truck_id,
      driver_id,
      assistant_id,
      start_time: start,
      end_time: end
    });

    const hydratedSchedule = await TruckSchedule.findByPk(newSchedule.truck_schedule_id, {
      include: includeRelations
    });

    if (order_id) {
      await completeTask(order_id, newSchedule.truck_schedule_id);
      const order = await Order.findByPk(order_id);
      if (order) {
        await order.update({
          status: 'scheduled',
          updated_at: new Date()
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Truck schedule created successfully.',
      data: { schedule: hydratedSchedule ? hydratedSchedule.toJSON() : null }
    });
  } catch (error) {
    console.error('[truckScheduleController.createTruckSchedule] failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating truck schedule',
      error: error.message
    });
  }
};

const checkAvailability = async (req, res) => {
  try {
    const { type, id, start, end, exclude } = req.query;

    if (!type || !id || !start || !end) {
      return res.status(400).json({
        success: false,
        message: 'Type, id, start, and end query parameters are required.'
      });
    }

    const startDate = parseDate(start);
    const endDate = parseDate(end);

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start or end time.'
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time.'
      });
    }

    const columnMap = {
      truck: 'truck_id',
      driver: 'driver_id',
      assistant: 'assistant_id'
    };

    const column = columnMap[type];

    if (!column) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Use truck, driver, or assistant.'
      });
    }

    const result = await checkResourceAvailable(column, id, startDate, endDate, exclude);

    return res.status(200).json({
      success: true,
      available: result.available,
      data: result.available ? null : { conflicts: result.conflicts }
    });
  } catch (error) {
    console.error('[truckScheduleController.checkAvailability] failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking availability',
      error: error.message
    });
  }
};

module.exports = {
  getTruckSchedules,
  createTruckSchedule,
  getPendingTruckTasks,
  checkAvailability
};
