import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CheckCheck, Clock3, MapPin, MessageSquareText, ShieldCheck, UserRound, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';
import { categoryName, dateLabel, dateTime, departmentName, STATUSES, statusName } from '../lib/config.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { ErrorBanner, Loading, PageHeader } from '../components/Ui.jsx';

export default function ComplaintDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState('in_progress');
  const [note, setNote] = useState('');
  const [reply, setReply] = useState('');
  const isAdmin = user.role !== 'student';

  async function load() {
    const data = await api.get(`/api/complaints/${id}`);
    setComplaint(data.complaint);
    setStatus(data.complaint.status);
  }
  useEffect(() => { let active = true; api.get(`/api/complaints/${id}`).then(data => { if (active) { setComplaint(data.complaint); setStatus(data.complaint.status); } }).catch(err => { if (active) setError(err.message); }); return () => { active = false; }; }, [id]);

  async function updateStatus(event) {
    event.preventDefault(); setPending(true); setActionError(''); setNotice('');
    try {
      await api.patch(`/api/complaints/${id}/status`, { status, note });
      setNote(''); await load(); setNotice('Status updated successfully.');
    } catch (err) { setActionError(err.message); }
    finally { setPending(false); }
  }

  async function sendReply(event) {
    event.preventDefault(); setPending(true); setActionError(''); setNotice('');
    try {
      await api.post(`/api/complaints/${id}/remarks`, { message: reply });
      setReply(''); await load(); setNotice('Reply sent to the student.');
    } catch (err) { setActionError(err.message); }
    finally { setPending(false); }
  }

  return <>
    <Link className="back-link" to="/complaints"><ArrowLeft size={17}/> Back to complaints</Link>
    {error && <ErrorBanner message={error}/>}
    {!complaint ? (!error && <Loading />) : <>
      <PageHeader eyebrow={complaint.ticketId} title={complaint.title} description={`Reported ${dateLabel(complaint.createdAt)} · ${categoryName(complaint.category)}`} action={<StatusBadge status={complaint.status}/>} />
      <div className="details-layout">
        <div className="details-primary">
          <section className="surface-card detail-card"><div className="section-header"><div><p className="eyebrow">COMPLAINT INFORMATION</p><h2>Overview</h2></div><span className={`priority-chip priority-${complaint.priority}`}>{complaint.priority} priority</span></div>
            <p className="complaint-description">{complaint.description}</p>
            {complaint.imageUrl && <a href={complaint.imageUrl} target="_blank" rel="noopener noreferrer" className="text-link">View supporting image</a>}
            <div className="detail-meta-grid">
              <div><ClipboardList size={17}/><span><small>Category</small><strong>{categoryName(complaint.category)}</strong></span></div>
              <div><ShieldCheck size={17}/><span><small>Assigned to</small><strong>{departmentName(complaint.department)}</strong></span></div>
              <div><MapPin size={17}/><span><small>Location</small><strong>{complaint.location || 'Not specified'}</strong></span></div>
              <div><CalendarDays size={17}/><span><small>Submitted on</small><strong>{dateLabel(complaint.createdAt)}</strong></span></div>
              {isAdmin && <div><UserRound size={17}/><span><small>Submitted by</small><strong>{complaint.student?.name || 'Student'}</strong></span></div>}
            </div>
          </section>
          <section className="surface-card detail-card"><div className="section-header"><div><p className="eyebrow">COMMUNICATION</p><h2>Department responses</h2></div><MessageSquareText size={21} className="faint-icon"/></div>
            {complaint.remarks?.length ? <div className="remarks-list">{complaint.remarks.map((r, index) => <div className="remark-item" key={r._id || index}><div className="remark-avatar">{r.authorName?.[0]?.toUpperCase() || 'A'}</div><div><div className="remark-by"><strong>{r.authorName}</strong><small>{dateTime(r.createdAt)}</small></div><p>{r.message}</p></div></div>)}</div> : <p className="soft-empty">No department responses yet. Updates will appear here.</p>}
            {isAdmin && <form onSubmit={sendReply} className="reply-box"><label className="field"><span>Send a response</span><textarea rows={3} maxLength={2000} required placeholder="Share an update with the student…" value={reply} onChange={e => setReply(e.target.value)}/></label><button disabled={pending} className="btn btn-primary">Send response <MessageSquareText size={16}/></button></form>}
          </section>
        </div>
        <aside className="details-side">
          <section className="surface-card detail-card"><div className="section-header"><div><p className="eyebrow">ISSUE TRACKING</p><h2>Status timeline</h2></div><Clock3 size={20} className="faint-icon"/></div>
            <div className="timeline">{(complaint.history || []).map((entry, index) => <div className="timeline-item" key={entry._id || index}><span className="timeline-point"><CheckCheck size={13}/></span><div><strong>{statusName(entry.status)}</strong><small>{dateTime(entry.changedAt)}</small><p>{entry.note || `Updated by ${entry.changedByName}`}</p></div></div>)}</div>
          </section>
          {isAdmin && <section className="surface-card detail-card admin-action"><div className="section-header"><div><p className="eyebrow">DEPARTMENT ACTIONS</p><h2>Update complaint</h2></div></div>
            <form className="form-stack" onSubmit={updateStatus}><label className="field"><span>New status</span><select value={status} onChange={e => setStatus(e.target.value)}>{STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></label>
              <label className="field"><span>{status === 'rejected' ? 'Rejection reason *' : 'Progress note (optional)'}</span><textarea rows={3} maxLength={2000} required={status === 'rejected'} placeholder="Explain what action was taken…" value={note} onChange={e => setNote(e.target.value)}/></label><button disabled={pending || (status === complaint.status && !note.trim())} className="btn btn-primary btn-block">Save status update</button></form>
          </section>}
          {notice && <div className="alert success"><CheckCheck size={18}/>{notice}</div>}
          <ErrorBanner message={actionError}/>
        </aside>
      </div>
    </>}
  </>;
}
