// Labels and formatting stay here; database access rules remain enforced by Express.
export const CATEGORIES = [
  { value: 'cafeteria', label: 'Cafeteria', department: 'Cafeteria Administration' },
  { value: 'library', label: 'Library', department: 'Library Administration' },
  { value: 'it', label: 'Labs & IT', department: 'Laboratory / IT Administration' },
  { value: 'academic', label: 'Academic Affairs', department: 'Teaching / Academic Administration' },
];
export const STATUSES = [
  { value: 'pending', label: 'Pending', color: '#C48634' },
  { value: 'in_progress', label: 'In progress', color: '#3184BA' },
  { value: 'resolved', label: 'Resolved', color: '#138153' },
  { value: 'rejected', label: 'Rejected', color: '#C95959' },
];
export const PRIORITIES = ['low', 'medium', 'high'];
export const categoryName = (v) => CATEGORIES.find(c => c.value === v)?.label || v || '—';
export const departmentName = (v) => CATEGORIES.find(c => c.value === v)?.department || v || '—';
export const statusName = (v) => STATUSES.find(s => s.value === v)?.label || v || '—';
export const roleName = (role) => ({ student: 'Student', department_admin: 'Department admin', super_admin: 'Super admin' }[role] || 'User');
export const dateLabel = (v) => v ? new Date(v).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const dateTime = (v) => v ? new Date(v).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
