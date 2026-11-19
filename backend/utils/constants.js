// Department assignment is always decided by the backend, never by a submitted student value.
const CATEGORIES = [
  { key: 'cafeteria', label: 'Cafeteria', department: 'cafeteria', departmentName: 'Cafeteria Administration' },
  { key: 'library', label: 'Library', department: 'library', departmentName: 'Library Administration' },
  { key: 'it', label: 'Laboratories & IT Facilities', department: 'it', departmentName: 'Laboratory / IT Administration' },
  { key: 'academic', label: 'Teaching & Academic Affairs', department: 'academic', departmentName: 'Teaching / Academic Administration' },
];
const CATEGORY_KEYS = CATEGORIES.map(item => item.key);
const DEPARTMENT_KEYS = [...new Set(CATEGORIES.map(item => item.department))];
const STATUS_KEYS = ['pending', 'in_progress', 'resolved', 'rejected'];
const DEPARTMENT_BY_CATEGORY = Object.fromEntries(CATEGORIES.map(item => [item.key, item.department]));

module.exports = { CATEGORIES, CATEGORY_KEYS, DEPARTMENT_KEYS, STATUS_KEYS, DEPARTMENT_BY_CATEGORY };
