const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TASK_FILE = path.join(__dirname, '..', 'config', 'truck-tasks.json');

const readFile = () => {
  try {
    if (!fs.existsSync(TASK_FILE)) {
      return [];
    }
    const content = fs.readFileSync(TASK_FILE, 'utf-8');
    if (!content.trim()) {
      return [];
    }
    return JSON.parse(content);
  } catch (error) {
    console.error('[truckTaskStore] Failed to read tasks file:', error.message);
    return [];
  }
};

const writeFile = (tasks) => {
  try {
    fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
  } catch (error) {
    console.error('[truckTaskStore] Failed to write tasks file:', error.message);
  }
};

const listPendingTasks = () => {
  return readFile().filter(task => task.status === 'pending');
};

const addOrUpdateTask = (data) => {
  const {
    order_id,
    truck_route_id
  } = data || {};

  if (!order_id || !truck_route_id) {
    return null;
  }

  const tasks = readFile();
  const existingIndex = tasks.findIndex(task => task.order_id === order_id);
  const now = new Date().toISOString();
  const base = existingIndex >= 0 ? tasks[existingIndex] : {};

  const payload = {
    id: base.id || uuidv4(),
    status: 'pending',
    created_at: base.created_at || now,
    ...base,
    ...data,
    updated_at: now
  };

  if (existingIndex >= 0) {
    tasks[existingIndex] = payload;
  } else {
    tasks.push(payload);
  }
  writeFile(tasks);
  return payload;
};

const completeTask = (order_id, schedule_id) => {
  if (!order_id) return null;
  const tasks = readFile();
  const index = tasks.findIndex(task => task.order_id === order_id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  tasks[index] = {
    ...tasks[index],
    status: 'scheduled',
    schedule_id: schedule_id || null,
    updated_at: now,
    completed_at: now
  };
  writeFile(tasks);
  return tasks[index];
};

module.exports = {
  listPendingTasks,
  addOrUpdateTask,
  completeTask
};
