import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Brand from '../components/Brand.jsx';
import { ErrorBanner } from '../components/Ui.jsx';

export default function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [fields, setFields] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  if (loading) return <div className="boot-screen"><span className="spinner"/> Loading…</div>;
  if (user) return <Navigate to="/dashboard" replace />;

  async function submit(event) {
    event.preventDefault(); setError(''); setPending(true);
    try {
      if (mode === 'register') await signUp(fields.name, fields.email, fields.password);
      else await signIn(fields.email, fields.password);
      navigate('/dashboard', { replace: true });
    } catch (err) { setError(err.message); }
    finally { setPending(false); }
  }

  function update(key, value) { setFields(current => ({ ...current, [key]: value })); }
  function changeMode(value) { setMode(value); setError(''); }

  return <div className="auth-layout">
    <section className="auth-showcase">
      <div className="auth-showcase-inner">
        <Brand />
        <div className="auth-copy"><span className="hero-kicker"><Sparkles size={15}/> CAMPUS EXPERIENCE, REIMAGINED</span>
          <h1>Your campus.<br/>Your voice.<br/><em>Real change.</em></h1>
          <p>One place to raise concerns, follow progress and create a better university experience together.</p>
          <div className="showcase-points"><span><CheckCircle2 size={18}/> Raise issues in minutes</span><span><CheckCircle2 size={18}/> Follow every update</span><span><CheckCircle2 size={18}/> Connect with the right department</span></div>
        </div>
        <div className="auth-showcase-footer"><ShieldCheck size={16}/> An initiative for the BIIT community <span>EST. 1998</span></div>
      </div>
      <div className="auth-rings" aria-hidden="true"/>
    </section>
    <section className="auth-form-area">
      <div className="auth-form-container">
        <div className="auth-mobile-brand"><Brand /></div>
        <div className="auth-small-icon"><LockKeyhole size={24}/></div>
        <p className="eyebrow">WELCOME TO CAMPUSCONNECT</p>
        <h2>{mode === 'login' ? 'Good to have you back.' : 'Be part of the change.'}</h2>
        <p className="form-intro">{mode === 'login' ? 'Sign in to view your campus dashboard.' : 'Create your student account to report and track issues.'}</p>
        <div className="auth-switch"><button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => changeMode('login')}>Sign in</button><button type="button" className={mode === 'register' ? 'selected' : ''} onClick={() => changeMode('register')}>Create account</button></div>
        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && <label className="field"><span>Full name</span><input autoComplete="name" placeholder="Your full name" minLength={2} maxLength={100} required value={fields.name} onChange={e => update('name', e.target.value)}/></label>}
          <label className="field"><span>Email address</span><input type="email" autoComplete="email" placeholder="you@university.edu" required value={fields.email} onChange={e => update('email', e.target.value)}/></label>
          <label className="field"><span>Password</span><input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'} minLength={mode === 'register' ? 8 : undefined} required value={fields.password} onChange={e => update('password', e.target.value)}/></label>
          <ErrorBanner message={error}/>
          <button className="btn btn-primary btn-block" disabled={pending}>{pending ? 'Please wait…' : mode === 'login' ? 'Sign in to dashboard' : 'Create student account'} <ArrowRight size={18}/></button>
        </form>
        <div className="demo-hint"><strong>Admin demonstration</strong><span>Sign in with an administrator account created by the backend seed script.</span><button type="button" onClick={() => { changeMode('login'); update('email', 'superadmin@campusconnect.local'); }}>Use Super Admin email</button></div>
        <p className="auth-help">Secure access · Department-based permissions · BIIT</p>
      </div>
    </section>
  </div>;
}
