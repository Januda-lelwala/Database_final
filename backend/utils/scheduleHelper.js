const db = require('../models');
const { listAllAssignments } = require('./assignmentStore');

const { TruckSchedule } = db;

let ensureLinksPromise = null;

const ensureScheduleOrderLinks = async () => {
  if (!TruckSchedule) return;

  if (!ensureLinksPromise) {
    ensureLinksPromise = (async () => {
      try {
        const assignments = listAllAssignments();
        if (!assignments || !assignments.length) return;

        const updates = assignments
          .filter((entry) => entry.order_id && entry.schedule_id)
          .map(async (entry) => {
            try {
              const schedule = await TruckSchedule.findByPk(entry.schedule_id);
              if (schedule && !schedule.order_id) {
                await schedule.update({ order_id: entry.order_id });
              }
            } catch (error) {
              console.warn('[scheduleHelper] failed linking schedule to order:', error.message);
            }
          });

        await Promise.all(updates);
      } catch (error) {
        console.warn('[scheduleHelper] ensureScheduleOrderLinks:', error.message);
      }
    })();
  }

  return ensureLinksPromise;
};

module.exports = {
  ensureScheduleOrderLinks
};

