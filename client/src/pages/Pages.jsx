import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Feedback } from '../components/ui/Feedback';
import { apiFetch } from '../api/index.js';
import { useAppContext } from '../context/AppContext.jsx';

export function Landing() {
  return <div className="mx-auto max-w-5xl px-6 py-20"><p className="mb-4 font-semibold text-cyan-300">SKILLFINDER</p><h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">Turn curiosity into a <span className="text-cyan-300">clear path.</span></h1><p className="mt-6 max-w-2xl text-lg text-slate-400">Explainable skill assessments and adaptive roadmaps for the skills you want to build next.</p><div className="mt-8 flex gap-3"><Link to="/register"><Button>Start assessment</Button></Link><Link to="/login"><Button variant="secondary">Sign in</Button></Link></div></div>;
}

export function Auth({ mode }) {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [state, setState] = useState({ loading: false, error: null, fields: {} });
  if (user) return <Navigate to="/dashboard" replace />;
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event) => {
    event.preventDefault();
    const fields = {};
    if (!form.email.trim()) fields.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) fields.email = 'Enter a valid email address';
    if (!form.password) fields.password = 'Password is required';
    else if (mode === 'register' && form.password.length < 8) fields.password = 'Password must be at least 8 characters';
    if (Object.keys(fields).length) {
      setState({ loading: false, error: null, fields });
      return;
    }
    setState({ loading: true, error: null, fields: {} });
    try {
      const { csrfToken } = await apiFetch('/auth/csrf');
      const response = await apiFetch(`/auth/${mode}`, { method: 'POST', headers: { 'x-csrf-token': csrfToken }, body: JSON.stringify(form) });
      setUser(response.user);
      navigate(mode === 'register' ? '/onboarding' : '/dashboard');
    } catch (error) { setState({ loading: false, error: error.message, fields: error.fieldErrors || {} }); }
  };
  const fieldError = (field) => state.fields[field] && <span id={`${field}-error`} className="mt-1 block text-sm text-rose-600" role="alert">{state.fields[field]}</span>;
  return <div className="mx-auto max-w-md py-10"><div className="card"><h2 className="text-2xl font-bold">{mode === 'register' ? 'Create your account' : 'Welcome back'}</h2><p className="mt-2 text-slate-400">Your learning journey starts here.</p><form className="mt-6 space-y-4" onSubmit={submit} noValidate><label className="block text-sm" htmlFor="auth-email">Email<input id="auth-email" className="field" type="email" value={form.email} onChange={(event) => { updateField('email', event.target.value); setState((current) => ({ ...current, fields: { ...current.fields, email: undefined }, error: null })); }} autoComplete="email" aria-invalid={Boolean(state.fields.email)} aria-describedby={state.fields.email ? 'email-error' : undefined} required />{fieldError('email')}</label><label className="block text-sm" htmlFor="auth-password">Password<input id="auth-password" className="field" type="password" value={form.password} onChange={(event) => { updateField('password', event.target.value); setState((current) => ({ ...current, fields: { ...current.fields, password: undefined }, error: null })); }} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 8 : undefined} aria-invalid={Boolean(state.fields.password)} aria-describedby={mode === 'register' ? `password-requirements${state.fields.password ? ' password-error' : ''}` : state.fields.password ? 'password-error' : undefined} required />{mode === 'register' && <span id="password-requirements" className="mt-1 block text-xs text-slate-500">Use at least 8 characters with an uppercase letter, lowercase letter, and number.</span>}{fieldError('password')}</label><Feedback error={state.error} /><Button type="submit" disabled={state.loading}>{state.loading ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Sign in'}</Button></form><p className="mt-5 text-sm text-slate-400">{mode === 'register' ? 'Already registered? ' : 'New to SkillFinder? '}<Link className="text-cyan-300" to={mode === 'register' ? '/login' : '/register'}>{mode === 'register' ? 'Sign in' : 'Create an account'}</Link></p></div></div>;
}

export function Onboarding() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [paths, setPaths] = useState([]);
  const [form, setForm] = useState({ fieldId: '', learningPathId: '', learningGoal: '', experienceLevel: 'beginner', targetDurationWeeks: 8, studyHoursPerWeek: 5, preferredLearningMethod: 'mixed' });
  const [state, setState] = useState({ loading: true, error: null });
  useEffect(() => { apiFetch('/fields').then(({ fields: items }) => { setFields(items); setState({ loading: false, error: null }); }).catch((error) => setState({ loading: false, error: error.message })); }, []);
  useEffect(() => { if (form.fieldId) apiFetch(`/fields/${form.fieldId}/paths`).then(({ paths: items }) => setPaths(items)).catch((error) => setState({ loading: false, error: error.message })); }, [form.fieldId]);
  const submit = (event) => { event.preventDefault(); navigate('/assessment', { state: form }); };
  if (state.loading) return <div className="card">Loading learning fields...</div>;
  return <div className="mx-auto max-w-2xl"><div className="card"><h2 className="text-2xl font-bold">Set your direction</h2><p className="mt-2 text-slate-400">We’ll use these preferences to shape your assessment and roadmap.</p><form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={submit}><label className="text-sm sm:col-span-2">Learning field<select className="field" value={form.fieldId} onChange={(e) => setForm({ ...form, fieldId: e.target.value, learningPathId: '' })} required><option value="">Choose a field</option>{fields.map((field) => <option key={field.id} value={field.id}>{field.name}</option>)}</select></label><label className="text-sm sm:col-span-2">Learning path<select className="field" value={form.learningPathId} onChange={(e) => setForm({ ...form, learningPathId: e.target.value })} required><option value="">Choose a path</option>{paths.map((path) => <option key={path.id} value={path.id}>{path.title}</option>)}</select></label><label className="text-sm sm:col-span-2">Learning goal<textarea className="field" rows="3" value={form.learningGoal} onChange={(e) => setForm({ ...form, learningGoal: e.target.value })} placeholder="What would you like to achieve?" required /></label><label className="text-sm">Experience level<select className="field" value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label><label className="text-sm">Target duration (weeks)<input className="field" type="number" min="1" max="104" value={form.targetDurationWeeks} onChange={(e) => setForm({ ...form, targetDurationWeeks: e.target.value })} /></label><label className="text-sm">Study hours / week<input className="field" type="number" min="1" max="168" value={form.studyHoursPerWeek} onChange={(e) => setForm({ ...form, studyHoursPerWeek: e.target.value })} /></label><label className="text-sm">Preferred method<select className="field" value={form.preferredLearningMethod} onChange={(e) => setForm({ ...form, preferredLearningMethod: e.target.value })}><option value="mixed">Mixed</option><option value="video">Video</option><option value="reading">Reading</option><option value="practice">Practice-first</option></select></label><div className="sm:col-span-2"><Feedback error={state.error} /><Button type="submit">Continue to assessment</Button></div></form></div></div>;
}

export function Assessment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, error: null, data: null });
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const creationStarted = useRef(false);
  useEffect(() => {
    const input = location.state;
    if (!input?.learningPathId) { navigate('/onboarding', { replace: true }); return; }
    if (creationStarted.current) return;
    creationStarted.current = true;
    (async () => {
      try {
        const csrf = await apiFetch('/auth/csrf');
        const created = await apiFetch('/assessments', { method: 'POST', headers: { 'x-csrf-token': csrf.csrfToken }, body: JSON.stringify(input) });
        const data = await apiFetch(`/assessments/${created.assessment.id}/questions`);
        setState({ loading: false, error: null, data: { ...data, id: created.assessment.id } });
      } catch (error) { setState({ loading: false, error: error.message, data: null }); }
    })();
  }, [location.state, navigate]);
  if (state.loading) return <div className="card">Preparing your assessment...</div>;
  if (state.error) return <div className="card"><Feedback error={state.error} /><Link className="text-cyan-300" to="/onboarding">Start again</Link></div>;
  const question = state.data.questions[index];
  const selected = answers[question.id] || [];
  const choose = async (optionId) => {
    const next = question.question_type === 'multi_choice' ? (selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId]) : [optionId];
    setAnswers({ ...answers, [question.id]: next });
    const csrf = await apiFetch('/auth/csrf');
    await apiFetch(`/assessments/${state.data.id}/answers/${question.id}`, { method: 'PUT', headers: { 'x-csrf-token': csrf.csrfToken }, body: JSON.stringify({ optionIds: next }) });
  };
  const finish = async () => {
    if (!selected.length) return;
    if (!window.confirm('Submit this assessment? You will not be able to change answers afterward.')) return;
    const csrf = await apiFetch('/auth/csrf');
    await apiFetch(`/assessments/${state.data.id}/submit`, { method: 'POST', headers: { 'x-csrf-token': csrf.csrfToken } });
    navigate(`/results/${state.data.id}`);
  };
  return <div className="mx-auto max-w-3xl"><div className="mb-5 flex justify-between text-sm text-slate-400"><span>Question {index + 1} of {state.data.questions.length}</span><span>{Math.round(((index + 1) / state.data.questions.length) * 100)}%</span></div><div className="mb-6 h-2 rounded bg-slate-800"><div className="h-2 rounded bg-cyan-400" style={{ width: `${((index + 1) / state.data.questions.length) * 100}%` }} /></div><div className="card"><p className="text-sm text-cyan-300">Skill check</p><h2 className="mt-3 text-2xl font-bold">{question.prompt}</h2><div className="mt-6 grid gap-3">{question.options.map((option) => <button type="button" key={option.id} onClick={() => choose(option.id)} className={`rounded-xl border p-4 text-left ${selected.includes(option.id) ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-700 hover:border-slate-500'}`}>{option.label}</button>)}</div><div className="mt-8 flex justify-between"><Button variant="secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</Button>{index === state.data.questions.length - 1 ? <Button onClick={finish} disabled={!selected.length}>Submit assessment</Button> : <Button onClick={() => setIndex(index + 1)} disabled={!selected.length}>Next</Button>}</div></div></div>;
}

export function Results() {
  const { assessmentId } = useParams();
  const [state, setState] = useState({ loading: true, error: null, results: null });
  useEffect(() => { apiFetch(`/assessments/${assessmentId}/results`).then(({ results }) => setState({ loading: false, error: null, results })).catch((error) => setState({ loading: false, error: error.message, results: null })); }, [assessmentId]);
  if (state.loading) return <div className="card">Loading results...</div>;
  if (state.error) return <div className="card"><Feedback error={state.error} /></div>;
  return <div><h2 className="text-3xl font-bold">Your skill profile</h2><p className="mt-2 text-slate-400">Scores are based on your submitted answers and are explainable.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{state.results.skills.map((skill) => <div className="card" key={skill.skillId}><div className="flex justify-between"><strong>{skill.name}</strong><span>{skill.assessed ? `${skill.score}%` : 'More evidence needed'}</span></div><div className="mt-3 h-2 rounded bg-slate-800"><div className="h-2 rounded bg-cyan-400" style={{ width: `${skill.score}%` }} /></div><p className="mt-3 text-sm text-slate-400">{skill.band} · {skill.explanation}</p></div>)}</div><div className="mt-6 card"><h3 className="text-xl font-semibold">Recommended next steps</h3>{state.results.priorities.map((item) => <p className="mt-3 text-slate-300" key={item.skillId}>{item.skill}: {item.reason}</p>)}</div></div>;
}

export function Roadmap() {
  const [state, setState] = useState({ loading: true, error: null, roadmaps: [], roadmap: null });
  const [generating, setGenerating] = useState(false);
  useEffect(() => {
    apiFetch('/roadmaps').then(({ roadmaps }) => setState({ loading: false, error: null, roadmaps, roadmap: null })).catch((error) => setState({ loading: false, error: error.message, roadmaps: [], roadmap: null }));
  }, []);
  const open = async (roadmapId) => {
    try { const { roadmap } = await apiFetch(`/roadmaps/${roadmapId}`); setState((current) => ({ ...current, roadmap })); } catch (error) { setState((current) => ({ ...current, error: error.message })); }
  };
  const generate = async () => {
    setGenerating(true);
    try {
      const { assessments } = await apiFetch('/assessments');
      const completed = assessments.find((assessment) => assessment.status === 'completed');
      if (!completed) throw new Error('Complete an assessment before generating a roadmap.');
      const csrf = await apiFetch('/auth/csrf');
      const { roadmap } = await apiFetch('/roadmaps/generate', { method: 'POST', headers: { 'x-csrf-token': csrf.csrfToken }, body: JSON.stringify({ assessmentId: completed.id, targetDurationDays: 60 }) });
      setState((current) => ({ ...current, roadmap, roadmaps: [roadmap, ...current.roadmaps] }));
    } catch (error) { setState((current) => ({ ...current, error: error.message })); } finally { setGenerating(false); }
  };
  const updateTask = async (taskId, status) => {
    const csrf = await apiFetch('/auth/csrf');
    await apiFetch(`/roadmaps/${state.roadmap.id}/tasks/${taskId}`, { method: 'PATCH', headers: { 'x-csrf-token': csrf.csrfToken }, body: JSON.stringify({ status }) });
    open(state.roadmap.id);
  };
  if (state.loading) return <div className="card">Loading roadmaps...</div>;
  if (state.error && !state.roadmap) return <div className="card"><Feedback error={state.error} /><Button onClick={generate} disabled={generating}>{generating ? 'Generating...' : 'Generate roadmap'}</Button></div>;
  if (!state.roadmap) return <div><div className="mb-6 flex items-center justify-between"><div><h2 className="text-3xl font-bold">Your roadmap</h2><p className="mt-2 text-slate-400">A prerequisite-aware plan based on your assessment.</p></div><Button onClick={generate} disabled={generating}>{generating ? 'Generating...' : 'Generate roadmap'}</Button></div>{state.roadmaps.length ? <div className="grid gap-4 md:grid-cols-2">{state.roadmaps.map((roadmap) => <button className="card text-left" key={roadmap.id} onClick={() => open(roadmap.id)}><p className="text-sm text-cyan-300">{roadmap.status}</p><h3 className="mt-2 text-xl font-semibold">{roadmap.target_outcome}</h3><p className="mt-2 text-sm text-slate-400">{roadmap.target_duration_days} days · {Math.round(roadmap.available_hours)} available hours</p></button>)}</div> : <div className="card"><p className="text-slate-400">No roadmap yet. Generate one after completing your assessment.</p></div>}</div>;
  const completed = state.roadmap.completed_tasks || 0;
  const total = state.roadmap.total_tasks || 0;
  const recommendations = state.roadmap.ai_recommendations || {};
  return <div>
    <div className="mb-6 flex items-start justify-between"><div><p className="text-cyan-300">PERSONALIZED ROADMAP</p><h2 className="mt-1 text-3xl font-bold">{state.roadmap.target_outcome}</h2><p className="mt-2 text-slate-400">{completed} of {total} tasks complete · {state.roadmap.target_duration_days} days</p></div><Button variant="secondary" onClick={() => setState((current) => ({ ...current, roadmap: null }))}>All roadmaps</Button></div>
    {state.roadmap.ai_status === 'personalized' && recommendations.assessmentExplanation && <section className="card mb-6"><p className="text-xs font-semibold tracking-wide text-cyan-300">AI PERSONALIZATION</p><p className="mt-2 text-slate-300">{recommendations.assessmentExplanation}</p><div className="mt-4 grid gap-4 md:grid-cols-2"><div><h3 className="font-semibold">Learning strategies</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">{(recommendations.learningStrategies || []).map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3 className="font-semibold">Practice activities</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">{(recommendations.practiceActivities || []).map((item) => <li key={item}>{item}</li>)}</ul></div></div>{recommendations.projects?.length > 0 && <div className="mt-4"><h3 className="font-semibold">Suggested projects</h3><div className="mt-2 grid gap-3 md:grid-cols-2">{recommendations.projects.map((project) => <div className="rounded-xl border border-slate-700 p-3" key={project.title}><p className="font-medium">{project.title}</p><p className="mt-1 text-sm text-slate-400">{project.description}</p></div>)}</div></div>}</section>}
    {state.roadmap.ai_status !== 'personalized' && <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">AI personalization unavailable{state.roadmap.ai_unavailable_reason ? ` (${state.roadmap.ai_unavailable_reason.replaceAll('_', ' ')})` : ''}. Your deterministic roadmap remains active.</div>}
    <div className="mb-6 h-3 rounded bg-slate-800"><div className="h-3 rounded bg-cyan-400" style={{ width: `${total ? completed / total * 100 : 0}%` }} /></div>{state.roadmap.phases.map((phase) => <section className="card mb-4" key={phase.id}><div className="flex justify-between"><div><h3 className="text-xl font-semibold">{phase.title}</h3><p className="mt-1 text-sm text-slate-400">{phase.objective}</p></div><span className="text-sm text-slate-400">Days {phase.startDay}–{phase.endDay}</span></div><div className="mt-5 space-y-3">{phase.tasks.map((task) => <div className="rounded-xl border border-slate-700 p-4" key={task.id}><div className="flex items-start justify-between gap-4"><div><h4 className="font-semibold">{task.title}</h4><p className="mt-1 text-sm text-slate-400">{task.learningObjective}</p><p className="mt-2 text-sm">{task.practiceInstructions}</p><div className="mt-2 flex flex-wrap gap-3 text-xs text-cyan-300">{task.resources.map((resource) => <a href={resource.url} target="_blank" rel="noreferrer" key={resource.id}>{resource.title}</a>)}</div></div><select className="field w-auto" value={task.status} onChange={(event) => updateTask(task.id, event.target.value)}><option value="not_started">Not started</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select></div></div>)}</div></section>)}</div>;
}

export function Dashboard() {
  const [state, setState] = useState({ loading: true, error: null, data: null, skills: [] });
  useEffect(() => { Promise.all([apiFetch('/progress/overview'), apiFetch('/progress/skills')]).then(([data, skillData]) => setState({ loading: false, error: null, data, skills: skillData.skills })).catch((error) => setState({ loading: false, error: error.message, data: null, skills: [] })); }, []);
  if (state.loading) return <div className="card">Loading your learning overview...</div>;
  if (state.error) return <div className="card"><Feedback error={state.error} /></div>;
  const current = state.data.current;
  if (!current) return <div className="card"><h2 className="text-2xl font-bold">Your dashboard is ready</h2><p className="mt-2 text-slate-400">Complete onboarding and generate a roadmap to see your progress here.</p><Link className="mt-4 inline-block text-cyan-300" to="/onboarding">Choose a learning goal →</Link></div>;
  const progress = current.total_tasks ? Math.round(current.completed_tasks / current.total_tasks * 100) : 0;
  const gaps = state.skills.filter((skill) => Number(skill.score) < 60).slice(0, 4);
  return <div><div className="mb-8"><p className="text-cyan-300">YOUR LEARNING DASHBOARD</p><h2 className="mt-1 text-3xl font-bold">{current.learning_goal || current.target_outcome}</h2><p className="mt-2 text-slate-400">{current.field_name} · {current.path_title}</p></div>
    <div className="grid gap-4 md:grid-cols-4"><div className="card"><p className="text-sm text-slate-400">Roadmap progress</p><p className="mt-2 text-3xl font-bold">{progress}%</p><p className="mt-1 text-sm text-slate-500">{current.completed_tasks} of {current.total_tasks} tasks</p></div><div className="card"><p className="text-sm text-slate-400">Weekly target</p><p className="mt-2 text-3xl font-bold">{current.study_hours_per_week}h</p><p className="mt-1 text-sm text-slate-500">planned study time</p></div><div className="card"><p className="text-sm text-slate-400">Active tasks</p><p className="mt-2 text-3xl font-bold">{current.active_tasks}</p><p className="mt-1 text-sm text-slate-500">in progress</p></div><div className="card"><p className="text-sm text-slate-400">Target duration</p><p className="mt-2 text-3xl font-bold">{current.target_duration_days}</p><p className="mt-1 text-sm text-slate-500">days</p></div></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="card"><h3 className="text-xl font-semibold">Recommended next task</h3>{current.next_task ? <div className="mt-4"><p className="font-medium">{current.next_task.title}</p><p className="mt-1 text-sm text-slate-400">Days {current.next_task.start_day}–{current.next_task.end_day} · {current.next_task.status.replace('_', ' ')}</p><Link className="mt-4 inline-block text-cyan-300" to="/skillproof">Open SkillProof →</Link></div> : <p className="mt-3 text-slate-400">All roadmap tasks are complete.</p>}</section><section className="card"><h3 className="text-xl font-semibold">Skill gaps</h3>{gaps.length ? <div className="mt-4 space-y-4">{gaps.map((skill) => <div key={skill.skill_id}><div className="flex justify-between text-sm"><span>{skill.name}</span><span>{Math.round(skill.score)}%</span></div><div className="mt-2 h-2 rounded bg-slate-800"><div className="h-2 rounded bg-amber-400" style={{ width: `${skill.score}%` }} /></div></div>)}</div> : <p className="mt-3 text-slate-400">No current skill gaps have been recorded.</p>}</section></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="card"><h3 className="text-xl font-semibold">Completed tasks</h3><div className="mt-4 space-y-3">{state.data.completedTasks.length ? state.data.completedTasks.map((task) => <div className="border-b border-slate-800 pb-3 text-sm" key={task.id}><span className="text-slate-300">{task.title}</span><span className="ml-2 text-emerald-300">Completed</span></div>) : <p className="text-slate-400">No completed tasks yet.</p>}</div></section><section className="card"><h3 className="text-xl font-semibold">Upcoming tasks</h3><div className="mt-4 space-y-3">{state.data.upcomingTasks.length ? state.data.upcomingTasks.map((task) => <div className="border-b border-slate-800 pb-3 text-sm" key={task.id}><span className="text-slate-300">{task.title}</span><span className="ml-2 text-slate-500">Days {task.start_day}–{task.end_day}</span></div>) : <p className="text-slate-400">No upcoming tasks.</p>}</div></section></div>
    <section className="card mt-6"><h3 className="text-xl font-semibold">Recent learning activity</h3>{state.data.recentActivity.length ? <div className="mt-4 space-y-3">{state.data.recentActivity.map((item, index) => <div className="flex justify-between border-b border-slate-800 pb-3 text-sm" key={`${item.created_at}-${index}`}><span className="text-slate-300">{item.title || item.change_type.replace('_', ' ')}</span><span className="text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span></div>)}</div> : <p className="mt-3 text-slate-400">Your completed tasks and SkillProof submissions will appear here.</p>}</section>
  </div>;
}

export function SkillProof() {
  const [state, setState] = useState({ loading: true, error: null, tasks: [], quiz: null, evidence: [], attempt: null });
  const [form, setForm] = useState({ skillId: '', title: '', description: '', sourceType: 'text', content: '', evidenceUrl: '' });
  const [selectedTask, setSelectedTask] = useState('');
  const load = async () => {
    try { const [{ roadmaps }, { evidence }] = await Promise.all([apiFetch('/roadmaps'), apiFetch('/skill-evidence')]); const tasks = []; for (const item of roadmaps) { const response = await apiFetch(`/roadmaps/${item.id}`); response.roadmap.phases.forEach((phase) => phase.tasks.forEach((task) => tasks.push({ ...task, roadmapTitle: response.roadmap.target_outcome }))); } setState({ loading: false, error: null, tasks, quiz: null, evidence }); }
    catch (error) { setState((current) => ({ ...current, loading: false, error: error.message })); }
  };
  useEffect(() => { load(); }, []);
  const openQuiz = async (task) => { try { const { quiz } = await apiFetch(`/tasks/${task.id}/quiz-attempts`); setSelectedTask(String(task.id)); setState((current) => ({ ...current, quiz, attempt: null })); } catch (error) { setState((current) => ({ ...current, error: error.message })); } };
  const submitQuiz = async (event) => { event.preventDefault(); const answers = [...event.currentTarget.querySelectorAll('[data-question]')].map((element) => ({ questionId: Number(element.dataset.question), optionIds: [Number(element.value)] })); try { const csrf = await apiFetch('/auth/csrf'); const { attempt } = await apiFetch(`/tasks/${selectedTask}/quiz-attempts`, { method: 'POST', headers: { 'x-csrf-token': csrf.csrfToken }, body: JSON.stringify({ answers }) }); setState((current) => ({ ...current, attempt })); } catch (error) { setState((current) => ({ ...current, error: error.message })); } };
  const submitEvidence = async (event) => { event.preventDefault(); try { const csrf = await apiFetch('/auth/csrf'); await apiFetch('/skill-evidence', { method: 'POST', headers: { 'x-csrf-token': csrf.csrfToken }, body: JSON.stringify({ ...form, skillId: Number(form.skillId) }) }); setForm({ skillId: '', title: '', description: '', sourceType: 'text', content: '', evidenceUrl: '' }); await load(); } catch (error) { setState((current) => ({ ...current, error: error.message })); } };
  if (state.loading) return <div className="card">Loading SkillProof...</div>;
  return <div><div className="mb-8"><p className="text-cyan-300">SKILLPROOF</p><h2 className="mt-1 text-3xl font-bold">Turn practice into evidence.</h2><p className="mt-2 text-slate-400">Task completion is separate from validated skill mastery.</p></div><Feedback error={state.error} />
    <div className="grid gap-6 lg:grid-cols-2"><section className="card"><h3 className="text-xl font-semibold">Task quizzes</h3><div className="mt-4 space-y-3">{state.tasks.filter((task) => task.status !== 'completed').slice(0, 8).map((task) => <div className="rounded-xl border border-slate-800 p-4" key={task.id}><p className="font-medium">{task.title}</p><p className="mt-1 text-sm text-slate-500">{task.roadmapTitle}</p><Button className="mt-3" variant="secondary" onClick={() => openQuiz(task)}>Take quiz</Button></div>)}{!state.tasks.length && <p className="text-slate-400">Generate a roadmap to unlock task quizzes.</p>}</div>{state.quiz && <form className="mt-6 space-y-4 border-t border-slate-800 pt-5" onSubmit={submitQuiz}><h4 className="font-semibold">{state.quiz.title}</h4>{state.quiz.questions.map((question) => <label className="block text-sm" key={question.questionId}>{question.prompt}<select className="field" data-question={question.questionId} required defaultValue=""><option value="">Choose an answer</option>{question.options.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label>)}<Button type="submit">Submit quiz</Button>{state.attempt && <p className={state.attempt.passed ? 'text-emerald-300' : 'text-amber-300'}>{state.attempt.feedback} Score: {state.attempt.score}%</p>}</form>}</section>
      <section className="card"><h3 className="text-xl font-semibold">Submit project evidence</h3><form className="mt-4 space-y-4" onSubmit={submitEvidence}><label className="block text-sm">Skill ID<input className="field" type="number" min="1" value={form.skillId} onChange={(e) => setForm({ ...form, skillId: e.target.value })} required /></label><label className="block text-sm">Title<input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label><label className="block text-sm">Description<textarea className="field" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label><label className="block text-sm">Evidence type<select className="field" value={form.sourceType} onChange={(e) => setForm({ ...form, sourceType: e.target.value })}><option value="text">Written evidence</option><option value="url">Project URL</option></select></label>{form.sourceType === 'text' ? <label className="block text-sm">Evidence<textarea className="field" rows="3" minLength="20" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required /></label> : <label className="block text-sm">URL<input className="field" type="url" value={form.evidenceUrl} onChange={(e) => setForm({ ...form, evidenceUrl: e.target.value })} required /></label>}<Button type="submit">Submit for review</Button></form><div className="mt-6 border-t border-slate-800 pt-5"><h4 className="font-semibold">Submission history</h4>{state.evidence.map((item) => <div className="mt-3 text-sm" key={item.id}><span className="text-slate-300">{item.title}</span><span className="ml-2 text-cyan-300">{item.status}</span><p className="text-slate-500">{item.skill_name}</p></div>)}</div></section></div></div>;
}

export function Profile() {
  const [state, setState] = useState({ loading: true, error: null, skills: [] });
  useEffect(() => { apiFetch('/progress/skills').then(({ skills }) => setState({ loading: false, error: null, skills })).catch((error) => setState({ loading: false, error: error.message, skills: [] })); }, []);
  if (state.loading) return <div className="card">Loading your skill profile...</div>;
  if (state.error) return <div className="card"><Feedback error={state.error} /></div>;
  return <div><p className="text-cyan-300">SKILL PROFILE</p><h2 className="mt-1 text-3xl font-bold">Your demonstrated skills</h2><p className="mt-2 text-slate-400">Assessment, quiz and verified-evidence signals are shown separately from task completion.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{state.skills.map((skill) => <div className="card" key={skill.skill_id}><div className="flex justify-between"><strong>{skill.name}</strong><span>{Math.round(skill.score)}%</span></div><div className="mt-3 h-2 rounded bg-slate-800"><div className="h-2 rounded bg-cyan-400" style={{ width: `${skill.score}%` }} /></div><p className="mt-3 text-sm text-slate-400">Source: {skill.source} · {skill.passed_quizzes} passed quiz{skill.passed_quizzes === 1 ? '' : 'zes'} · {skill.verified_evidence} verified evidence</p></div>)}</div></div>;
}
export function Placeholder({ title, description }) { return <div className="card"><h2 className="text-2xl font-bold">{title}</h2><p className="mt-2 text-slate-400">{description}</p><div className="mt-6"><Feedback message="This foundation route is ready for the next vertical-slice implementation." /></div></div>; }
