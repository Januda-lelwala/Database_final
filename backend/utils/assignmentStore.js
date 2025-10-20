const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const STORE_PATH = path.join(__dirname, '..', 'config', 'driver-requests.json');

const safeRead = () => {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      return [];
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('[assignmentStore] read failed:', error.message);
    return [];
  }
};

const safeWrite = (entries) => {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(entries, null, 2), 'utf-8');
  } catch (error) {
    console.error('[assignmentStore] write failed:', error.message);
  }
};

const normalizeEntry = (base = {}, payload = {}) => {
  const now = new Date().toISOString();
  const {
    role,
    user_id,
    order_id = null,
    schedule_id = null,
    trip_id = null,
    customer_name = null,
    destination_address = null,
    destination_city = null,
    delivery_date = null,
    status = 'pending'
  } = payload;

  return {
    id: base.id || uuidv4(),
    role,
    user_id,
    order_id,
    schedule_id,
    trip_id,
    customer_name,
    destination_address,
    destination_city,
    delivery_date,
    status: status === 'accepted' ? 'accepted' : 'pending',
    created_at: base.created_at || now,
    updated_at: now
  };
};

const addAssignment = (payload) => {
  if (!payload?.role || !payload?.user_id) return null;
  const entries = safeRead();
  const index = entries.findIndex(
    (entry) =>
      entry.role === payload.role &&
      entry.user_id === payload.user_id &&
      (payload.schedule_id ? entry.schedule_id === payload.schedule_id : false) &&
      (payload.order_id ? entry.order_id === payload.order_id : false)
  );

  const base = index >= 0 ? entries[index] : {};
  const entry = normalizeEntry(base, {
    ...payload,
    status: payload.status || 'pending'
  });

  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }

  safeWrite(entries);
  return entry;
};

const listAssignmentsForRole = (role, userId) => {
  if (!role || !userId) return [];
  const entries = safeRead();
  return entries
    .filter((entry) => entry.role === role && entry.user_id === userId)
    .sort((a, b) => {
      if (a.status === b.status) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // Pending items first
      return a.status === 'pending' ? -1 : 1;
    });
};

const updateAssignmentStatus = (id, role, userId, status) => {
  const entries = safeRead();
  const index = entries.findIndex(
    (entry) => entry.id === id && entry.role === role && entry.user_id === userId
  );
  if (index === -1) return null;

  const now = new Date().toISOString();
  entries[index] = {
    ...entries[index],
    status,
    updated_at: now
  };
  safeWrite(entries);
  return entries[index];
};

module.exports = {
  addAssignment,
  listAssignmentsForRole,
  updateAssignmentStatus
};

