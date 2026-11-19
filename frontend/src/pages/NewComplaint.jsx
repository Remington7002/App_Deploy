import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, MapPin, Send, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api.js';
import { CATEGORIES, PRIORITIES } from '../lib/config.js';
import { PageHeader, ErrorBanner } from '../components/Ui.jsx';

export default function NewComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', category: '', description: '', location: '', priority: 'medium', imageUrl: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const chosen = CATEGORIES.find(c => c.value === form.category);
  function update(key, value) { setForm(curr => ({ ...curr, [key]: value })); }
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const data = await api.post('/api/complaints', form);
      navigate(`/complaints/${data.complaint._id}`, { replace: true });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <>
    <Link className="back-link" to="/complaints"><ArrowLeft size={17}/> Back to complaints</Link>
    <PageHeader eyebrow="REPORT AN ISSUE" title="Raise a complaint" description="Tell us what's going on. We'll connect you to the right department."/>
    <div className="form-layout"><section className="surface-card form-card"><div className="section-header"><div><p className="eyebrow">COMPLAINT DETAILS</p><h2>Tell us about the issue</h2></div><span className="step-pill">01 / 01</span></div>
      <form className="form-stack" onSubmit={submit}>
        <label className="field"><span>Complaint title <b>*</b></span><input placeholder="e.g. Wi-Fi not working in Computer Lab 2" minLength={5} maxLength={150} required value={form.title} onChange={e => update('title', e.target.value)}/></label>
        <label className="field"><span>Category <b>*</b></span><select required value={form.category} onChange={e => update('category', e.target.value)}><option value="">Choose a category</option>{CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></label>
        {chosen && <div className="routing-note"><CheckCircle2 size={19}/><span>Automatically routed to <strong>{chosen.department}</strong></span></div>}
        <label className="field"><span>Description <b>*</b></span><textarea rows={5} minLength={10} maxLength={5000} placeholder="Describe the issue, when it occurred and what needs attention…" required value={form.description} onChange={e => update('description', e.target.value)}/><small>Provide enough detail to help the department respond quickly.</small></label>
        <div className="form-two-columns"><label className="field"><span>Location <span className="optional">(optional)</span></span><input placeholder="e.g. Second floor, Lab 2" maxLength={150} value={form.location} onChange={e => update('location', e.target.value)}/></label>
          <label className="field"><span>Priority</span><select value={form.priority} onChange={e => update('priority', e.target.value)}>{PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}</select></label></div>
        <label className="field"><span>Supporting image link <span className="optional">(optional)</span></span><input type="url" placeholder="https://example.com/photo.jpg" value={form.imageUrl} onChange={e => update('imageUrl', e.target.value)}/><small>Paste a publicly accessible image URL. Direct file uploads are not enabled.</small></label>
        <ErrorBanner message={error}/>
        <div className="form-actions"><Link to="/complaints" className="btn btn-outline">Cancel</Link><button disabled={busy} className="btn btn-primary" type="submit">{busy ? 'Submitting…' : 'Submit complaint'} <Send size={17}/></button></div>
      </form></section>
      <aside className="form-side"><div className="tips-card"><span className="tips-icon"><CircleHelp size={25}/></span><h3>What happens next?</h3><div className="tips-step"><span>01</span><p><strong>Submit your complaint</strong><small>Describe the issue and choose a category.</small></p></div><div className="tips-step"><span>02</span><p><strong>Automatic routing</strong><small>We assign it to the correct department.</small></p></div><div className="tips-step"><span>03</span><p><strong>Stay in the loop</strong><small>Track status changes and replies.</small></p></div></div><div className="privacy-note"><ShieldCheck size={19}/><p>Only you, your assigned department and authorized central administrators can access your complaint.</p></div></aside>
    </div>
  </>;
}
