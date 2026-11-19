import { Inbox, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-heading">
    <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="heading-desc">{description}</p>}</div>
    {action && <div className="heading-action">{action}</div>}
  </div>;
}

export function Loading({ label = 'Loading your data…' }) {
  return <div className="loading-state"><span className="spinner" /> {label}</div>;
}

export function ErrorBanner({ message }) {
  return message ? <div className="alert error" role="alert"><AlertCircle size={18} />{message}</div> : null;
}

export function EmptyState({ title = 'Nothing here yet', description, link, linkText }) {
  return <div className="empty-state">
    <div className="empty-icon"><Inbox size={27}/></div>
    <h3>{title}</h3><p>{description || 'Try another filter or create a new complaint.'}</p>
    {link && <Link className="btn btn-primary" to={link}>{linkText || 'Get started'} <ArrowRight size={16}/></Link>}
  </div>;
}

export function StatCard({ icon: Icon, label, value, sub, tint = 'green' }) {
  return <div className="stat-card">
    <div className={`stat-icon tint-${tint}`}><Icon size={21}/></div>
    <div><div className="stat-value">{value ?? '—'}</div><div className="stat-label">{label}</div>{sub && <div className="stat-sub">{sub}</div>}</div>
  </div>;
}
