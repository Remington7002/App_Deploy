import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, CheckCheck, ClipboardList, TrendingUp } from 'lucide-react';
import { api } from '../lib/api.js';
import { STATUSES } from '../lib/config.js';
import { ErrorBanner, Loading, PageHeader, StatCard } from '../components/Ui.jsx';

const COLORS = ['#0C774A', '#5D9E7B', '#CEAB65', '#7DAEAE'];
export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; api.get('/api/dashboard/stats').then(d => { if (active) setData(d); }).catch(e => { if (active) setError(e.message); }); return () => { active = false; }; }, []);

  const byStatus = STATUSES.map(s => ({ name: s.label, count: data?.byStatus?.[s.value] || 0, color: s.color }));
  const byDepartment = (data?.byDepartment || []).map(d => ({ name: ({ cafeteria: 'Cafeteria', library: 'Library', it: 'Labs & IT', academic: 'Academics' }[d.department] || d.department), count: d.count }));
  const byCategory = (data?.byCategory || []).map(d => ({ name: d.label, count: d.count }));

  return <>
    <PageHeader eyebrow="DATA & INSIGHTS" title="Campus analytics" description="An overview of common issues, department activity and resolution progress."/>
    <ErrorBanner message={error}/>
    {!data ? (!error && <Loading />) : <>
      <div className="stat-grid"><StatCard icon={ClipboardList} label="Total complaints" value={data.total}/><StatCard icon={CheckCheck} label="Resolved" value={data.byStatus.resolved}/><StatCard icon={TrendingUp} label="Resolution rate" value={`${data.resolutionRate}%`}/><StatCard icon={BarChart3} label="In progress" value={data.byStatus.in_progress} tint="blue"/></div>
      <div className="analytics-grid">
        <section className="surface-card chart-card"><div className="section-header"><div><p className="eyebrow">DEPARTMENT ACTIVITY</p><h2>Complaints by department</h2></div></div><div className="visual-chart"><ResponsiveContainer width="100%" height={285}><BarChart data={byDepartment} margin={{ top: 10, right: 8, left: -20, bottom: 10 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7EEE8"/><XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7A8981' }} axisLine={false} tickLine={false}/><YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#7A8981' }} axisLine={false} tickLine={false}/><Tooltip cursor={{ fill: '#F3F7F3' }}/><Bar dataKey="count" name="Complaints" fill="#0C774A" radius={[6, 6, 0, 0]} barSize={42}/></BarChart></ResponsiveContainer></div></section>
        <section className="surface-card chart-card"><div className="section-header"><div><p className="eyebrow">ISSUE BREAKDOWN</p><h2>Complaints by status</h2></div></div><div className="visual-chart"><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={byStatus.some(v => v.count) ? byStatus : [{ name:'No complaints', count: 1, color:'#E7EEE8' }]} dataKey="count" nameKey="name" outerRadius={93} innerRadius={55} paddingAngle={2}>{(byStatus.some(v => v.count) ? byStatus : [{ color:'#E7EEE8' }]).map((s, i) => <Cell key={i} fill={s.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><div className="compact-legend">{byStatus.map(s => <span key={s.name}><i style={{ background: s.color }}/>{s.name}: <strong>{s.count}</strong></span>)}</div></section>
      </div>
      <section className="surface-card chart-card"><div className="section-header"><div><p className="eyebrow">WHERE HELP IS NEEDED</p><h2>Category comparison</h2></div></div><div className="category-comparison">{byCategory.map((c, i) => <div className="comparison-row" key={c.name}><div><strong>{c.name}</strong><span>{c.count} {c.count === 1 ? 'complaint' : 'complaints'}</span></div><div className="track"><div className="fill" style={{ background: COLORS[i % COLORS.length], width: `${data.total ? Math.max(0, c.count/data.total*100) : 0}%` }}/></div></div>)}</div></section>
    </>}
  </>;
}
