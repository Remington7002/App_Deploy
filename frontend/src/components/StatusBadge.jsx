import { statusName } from '../lib/config.js';
export default function StatusBadge({ status }) {
  return <span className={`status-badge status-${status || 'pending'}`}><span className="status-dot" /> {statusName(status)}</span>;
}
