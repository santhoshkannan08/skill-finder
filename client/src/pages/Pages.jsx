import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Feedback } from '../components/ui/Feedback';
import { apiFetch } from '../api/index.js';
import { useAppContext } from '../context/AppContext.jsx';
import { Award, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Clock, Compass, Flame, HelpCircle, Layers, Lightbulb, MapPin, RefreshCw, Sparkles, Target, Trophy } from 'lucide-react';

export function Landing() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 text-center md:text-left">
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
        <Sparkles size={14} /> ADAPTIVE CAREER & SKILL INTELLIGENCE
      </div>
      <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-tight text-slate-900 md:text-7xl">
        Turn curiosity into a <span className="text-blue-600">clear career path.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-slate-600">
        Take diagnostic skill assessments across 7 domains and receive multiple tailored career roadmap options with weekly milestones and curated learning resources.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
        <Link to="/onboarding"><Button>Start assessment</Button></Link>
        <Link to="/login"><Button variant="secondary">Sign in</Button></Link>
      </div>

      <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
        <div className="card">
          <div className="mb-3 inline-flex rounded-xl bg-blue-50 p-2.5 text-blue-600"><Compass size={22} /></div>
          <h2 className="text-lg font-bold text-slate-900">7 Core Domains</h2>
          <p className="mt-1 text-sm text-slate-500">From Technology and Science to Sports and Arts, test your foundational and applied competencies.</p>
        </div>
        <div className="card">
          <div className="mb-3 inline-flex rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><Layers size={22} /></div>
          <h2 className="text-lg font-bold text-slate-900">Multiple Career Paths</h2>
          <p className="mt-1 text-sm text-slate-500">Receive 3–5 distinct career recommendations based on your demonstrated strengths and gaps.</p>
        </div>
        <div className="card">
          <div className="mb-3 inline-flex rounded-xl bg-emerald-50 p-2.5 text-emerald-600"><CheckCircle2 size={22} /></div>
          <h2 className="text-lg font-bold text-slate-900">Adaptive Roadmaps</h2>
          <p className="mt-1 text-sm text-slate-500">Generate structured learning phases with realistic timelines, projects, and task verification.</p>
        </div>
      </div>
    </div>
  );
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
      const response = await apiFetch(`/auth/${mode}`, {
        method: 'POST',
        headers: { 'x-csrf-token': csrfToken },
        body: JSON.stringify(form)
      });
      setUser(response.user);
      navigate(mode === 'register' ? '/onboarding' : '/dashboard');
    } catch (error) {
      setState({ loading: false, error: error.message, fields: error.fieldErrors || {} });
    }
  };

  const loginDemo = async () => {
    setState({ loading: true, error: null, fields: {} });
    try {
      const response = await apiFetch('/auth/demo', { method: 'POST' });
      setUser(response.user);
      navigate('/onboarding');
    } catch (err) {
      setState({ loading: false, error: err.message, fields: {} });
    }
  };

  const fieldError = (field) => state.fields[field] && (
    <span id={`${field}-error`} className="mt-1 block text-sm text-rose-600" role="alert">{state.fields[field]}</span>
  );

  return (
    <div className="mx-auto max-w-md py-10 px-4">
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-900">{mode === 'register' ? 'Create your account' : 'Welcome back'}</h2>
        <p className="mt-2 text-slate-500">Your personalized skill discovery journey starts here.</p>

        <div className="mt-4 rounded-xl bg-blue-50/80 p-3 text-xs text-blue-800">
          Want a quick evaluation? Click below to immediately sign in as a student without registration.
        </div>
        <button
          type="button"
          onClick={loginDemo}
          disabled={state.loading}
          className="mt-3 w-full rounded-xl border border-blue-300 bg-white py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
        >
          ⚡ Sign in as Demo Student
        </button>

        <div className="relative my-6 text-center text-xs text-slate-400">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <span className="relative bg-white px-2">or continue with email</span>
        </div>

        <form className="space-y-4" onSubmit={submit} noValidate>
          <label className="block text-sm font-medium text-slate-700" htmlFor="auth-email">
            Email address
            <input
              id="auth-email"
              className="field"
              type="email"
              value={form.email}
              onChange={(e) => {
                updateField('email', e.target.value);
                setState((c) => ({ ...c, fields: { ...c.fields, email: undefined }, error: null }));
              }}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
            {fieldError('email')}
          </label>

          <label className="block text-sm font-medium text-slate-700" htmlFor="auth-password">
            Password
            <input
              id="auth-password"
              className="field"
              type="password"
              value={form.password}
              onChange={(e) => {
                updateField('password', e.target.value);
                setState((c) => ({ ...c, fields: { ...c.fields, password: undefined }, error: null }));
              }}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              required
            />
            {mode === 'register' && (
              <span className="mt-1 block text-xs text-slate-500">Use at least 8 characters.</span>
            )}
            {fieldError('password')}
          </label>

          <Feedback error={state.error} />

          <Button type="submit" disabled={state.loading} className="w-full">
            {state.loading ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          {mode === 'register' ? 'Already registered? ' : 'New to SkillFinder? '}
          <Link className="font-semibold text-blue-600 hover:underline" to={mode === 'register' ? '/login' : '/register'}>
            {mode === 'register' ? 'Sign in' : 'Create an account'}
          </Link>
        </p>
      </div>
    </div>
  );
}

export function Onboarding() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [loadedQuestions, setLoadedQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState(null);

  const [preferences, setPreferences] = useState({
    experienceLevel: 'beginner',
    targetDurationWeeks: 8,
    studyHoursPerWeek: 5,
    preferredLearningMethod: 'mixed'
  });

  const [loadingFields, setLoadingFields] = useState(true);
  const [fieldsError, setFieldsError] = useState(null);
  const [creatingAssessment, setCreatingAssessment] = useState(false);

  // Load all 7 domains on mount
  useEffect(() => {
    apiFetch('/fields')
      .then(({ fields: items }) => {
        setFields(items || []);
        setLoadingFields(false);
      })
      .catch((err) => {
        setFieldsError(err.message);
        setLoadingFields(false);
      });
  }, []);

  // When domain is selected: immediately load questions from backend
  const handleDomainSelect = async (fieldId) => {
    setSelectedFieldId(fieldId);
    setLoadedQuestions([]);
    setQuestionsError(null);
    if (!fieldId) return;

    setQuestionsLoading(true);
    try {
      const data = await apiFetch(`/fields/${fieldId}/questions`);
      setLoadedQuestions(data.questions || []);
    } catch (err) {
      setQuestionsError(`Failed to load assessment questions: ${err.message}`);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleStartAssessment = async (event) => {
    event.preventDefault();
    if (!selectedFieldId) return;

    setCreatingAssessment(true);
    try {
      const { csrfToken } = await apiFetch('/auth/csrf');
      const created = await apiFetch('/assessments', {
        method: 'POST',
        headers: { 'x-csrf-token': csrfToken },
        body: JSON.stringify({
          fieldId: Number(selectedFieldId),
          experienceLevel: preferences.experienceLevel,
          targetDurationWeeks: Number(preferences.targetDurationWeeks),
          studyHoursPerWeek: Number(preferences.studyHoursPerWeek),
          preferredLearningMethod: preferences.preferredLearningMethod
        })
      });

      navigate('/assessment', {
        state: { assessmentId: created.assessment.id, fieldId: selectedFieldId }
      });
    } catch (err) {
      setQuestionsError(`Assessment initialization failed: ${err.message}`);
      setCreatingAssessment(false);
    }
  };

  if (loadingFields) {
    return <div className="card text-center py-12 text-slate-500">Loading learning domains...</div>;
  }

  if (fieldsError) {
    return (
      <div className="card max-w-lg mx-auto text-center py-8">
        <Feedback error={fieldsError} />
        <Button className="mt-4" onClick={() => window.location.reload()}>Retry loading domains</Button>
      </div>
    );
  }

  const selectedField = fields.find((f) => String(f.id) === String(selectedFieldId));

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="card">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Step 1 of 3</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">Select your learning domain</h2>
          <p className="mt-2 text-slate-500">
            Choose a field to immediately load its verified diagnostic questions. After completing the assessment, you will receive 3–5 tailored career roadmap options.
          </p>
        </div>

        {/* 7 Domains Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => {
            const isSelected = String(field.id) === String(selectedFieldId);
            return (
              <button
                key={field.id}
                type="button"
                onClick={() => handleDomainSelect(String(field.id))}
                className={`flex flex-col text-left rounded-xl border p-4 transition ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{field.name}</span>
                  {isSelected && <CheckCircle2 size={18} className="text-blue-600" />}
                </div>
                <p className="mt-2 text-xs text-slate-500 line-clamp-2">{field.description}</p>
              </button>
            );
          })}
        </div>

        {/* Feedback / Loaded Questions Summary */}
        {questionsLoading && (
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-center text-sm text-blue-700">
            <RefreshCw size={16} className="inline mr-2 animate-spin" />
            Loading assessment questions for {selectedField?.name}...
          </div>
        )}

        {questionsError && (
          <div className="mt-6">
            <Feedback error={questionsError} />
            <button
              type="button"
              onClick={() => handleDomainSelect(selectedFieldId)}
              className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
            >
              Retry loading questions
            </button>
          </div>
        )}

        {selectedFieldId && loadedQuestions.length > 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                  <CheckCircle2 size={12} /> {loadedQuestions.length} Questions Ready
                </span>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{selectedField?.name} Assessment</h3>
              </div>
              <p className="text-xs text-slate-500">Estimated duration: ~10–15 minutes</p>
            </div>

            <form onSubmit={handleStartAssessment} className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Current experience level
                <select
                  className="field"
                  value={preferences.experienceLevel}
                  onChange={(e) => setPreferences({ ...preferences, experienceLevel: e.target.value })}
                >
                  <option value="beginner">Beginner (Building foundations)</option>
                  <option value="intermediate">Intermediate (Some practical experience)</option>
                  <option value="advanced">Advanced (Deep knowledge)</option>
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700">
                Planned study hours / week
                <input
                  className="field"
                  type="number"
                  min="1"
                  max="40"
                  value={preferences.studyHoursPerWeek}
                  onChange={(e) => setPreferences({ ...preferences, studyHoursPerWeek: e.target.value })}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Preferred learning method
                <select
                  className="field"
                  value={preferences.preferredLearningMethod}
                  onChange={(e) => setPreferences({ ...preferences, preferredLearningMethod: e.target.value })}
                >
                  <option value="mixed">Mixed (Concepts + Practice)</option>
                  <option value="practice">Hands-on project first</option>
                  <option value="reading">In-depth guides & articles</option>
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700">
                Target learning window (weeks)
                <input
                  className="field"
                  type="number"
                  min="2"
                  max="52"
                  value={preferences.targetDurationWeeks}
                  onChange={(e) => setPreferences({ ...preferences, targetDurationWeeks: e.target.value })}
                />
              </label>

              <div className="sm:col-span-2 pt-2">
                <Button type="submit" disabled={creatingAssessment} className="w-full sm:w-auto">
                  {creatingAssessment ? 'Initializing assessment...' : `Begin ${selectedField?.name} Assessment →`}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export function Assessment() {
  const location = useLocation();
  const navigate = useNavigate();

  const [assessmentId, setAssessmentId] = useState(location.state?.assessmentId || null);
  const [state, setState] = useState({ loading: true, error: null, assessment: null, questions: [] });
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [savingStatus, setSavingStatus] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // If no assessmentId in route state, check active assessments or redirect to onboarding
  useEffect(() => {
    let currentId = assessmentId;
    (async () => {
      try {
        if (!currentId) {
          const { assessments } = await apiFetch('/assessments');
          const active = assessments?.find((a) => a.status === 'in_progress');
          if (active) {
            currentId = active.id;
            setAssessmentId(active.id);
          } else {
            navigate('/onboarding', { replace: true });
            return;
          }
        }

        const data = await apiFetch(`/assessments/${currentId}/questions`);
        const initialAnswers = {};
        data.questions.forEach((q) => {
          if (q.answer?.option_ids?.length) {
            initialAnswers[q.id] = q.answer.option_ids;
          } else if (q.answer?.option_id) {
            initialAnswers[q.id] = [q.answer.option_id];
          }
        });

        setAnswers(initialAnswers);
        setState({
          loading: false,
          error: null,
          assessment: data.assessment,
          questions: data.questions || []
        });
      } catch (err) {
        setState({ loading: false, error: err.message, assessment: null, questions: [] });
      }
    })();
  }, [assessmentId, navigate]);

  const currentQuestion = state.questions[index];
  const selectedOptions = currentQuestion ? answers[currentQuestion.id] || [] : [];

  const handleSelectOption = async (optionId) => {
    if (!currentQuestion) return;
    setValidationError(null);

    const nextOptions = currentQuestion.question_type === 'multi_choice'
      ? (selectedOptions.includes(optionId)
          ? selectedOptions.filter((id) => id !== optionId)
          : [...selectedOptions, optionId])
      : [optionId];

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: nextOptions }));
    setSavingStatus((prev) => ({ ...prev, [currentQuestion.id]: 'saving' }));

    try {
      const { csrfToken } = await apiFetch('/auth/csrf');
      await apiFetch(`/assessments/${assessmentId}/answers/${currentQuestion.id}`, {
        method: 'PUT',
        headers: { 'x-csrf-token': csrfToken },
        body: JSON.stringify({ optionIds: nextOptions })
      });
      setSavingStatus((prev) => ({ ...prev, [currentQuestion.id]: 'saved' }));
    } catch {
      setSavingStatus((prev) => ({ ...prev, [currentQuestion.id]: 'error' }));
    }
  };

  const handleNext = () => {
    if (!selectedOptions.length) {
      setValidationError('Please select an answer before continuing.');
      return;
    }
    setValidationError(null);
    if (index < state.questions.length - 1) {
      setIndex(index + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handlePrevious = () => {
    setValidationError(null);
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    setSubmitting(true);
    try {
      const { csrfToken } = await apiFetch('/auth/csrf');
      await apiFetch(`/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: { 'x-csrf-token': csrfToken }
      });
      navigate(`/results/${assessmentId}`);
    } catch (err) {
      setValidationError(`Submission failed: ${err.message}`);
      setSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  if (state.loading) {
    return <div className="card text-center py-12 text-slate-500">Preparing assessment questions...</div>;
  }

  if (state.error || !currentQuestion) {
    return (
      <div className="card max-w-lg mx-auto text-center py-8">
        <Feedback error={state.error || 'No questions available.'} />
        <Link to="/onboarding" className="mt-4 inline-block"><Button>Choose a domain</Button></Link>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).filter((qid) => answers[qid]?.length > 0).length;
  const progressPercent = Math.round(((index + 1) / state.questions.length) * 100);

  return (
    <div className="mx-auto max-w-3xl py-4">
      {/* Top progress bar */}
      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <span className="font-semibold text-slate-700">Question {index + 1} of {state.questions.length}</span>
        <span>{answeredCount} of {state.questions.length} answered ({progressPercent}%)</span>
      </div>
      <div className="mb-6 h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="card">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-blue-600">
            {state.assessment?.field_name || 'Skill Assessment'}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 font-medium">
            Difficulty {currentQuestion.difficulty || 1}/3
          </span>
        </div>

        <h2 className="mt-3 text-xl font-bold text-slate-900 md:text-2xl">
          {currentQuestion.prompt}
        </h2>

        {/* Options */}
        <div className="mt-6 space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            return (
              <button
                type="button"
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <span className="text-sm font-medium text-slate-800">{option.label}</span>
              </button>
            );
          })}
        </div>

        {validationError && (
          <div className="mt-4 text-sm text-rose-600 font-medium" role="alert">
            {validationError}
          </div>
        )}

        {/* Bottom controls */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
          <Button
            variant="secondary"
            disabled={index === 0}
            onClick={handlePrevious}
            className="gap-1.5"
          >
            <ChevronLeft size={16} /> Previous
          </Button>

          <div className="text-xs text-slate-400">
            {savingStatus[currentQuestion.id] === 'saving' && 'Saving answer...'}
            {savingStatus[currentQuestion.id] === 'saved' && '✓ Answer saved'}
          </div>

          {index === state.questions.length - 1 ? (
            <Button onClick={handleNext} className="gap-1.5">
              Review & Submit
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-1.5">
              Next <ChevronRight size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900">Ready to submit your assessment?</h3>
            <p className="mt-2 text-sm text-slate-500">
              You answered {answeredCount} of {state.questions.length} questions. Once submitted, your scores will be calculated deterministically and you will receive multiple career roadmap options.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                disabled={submitting}
                onClick={() => setShowSubmitModal(false)}
              >
                Review answers
              </Button>
              <Button
                disabled={submitting}
                onClick={handleSubmitAssessment}
              >
                {submitting ? 'Calculating results...' : 'Confirm & Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Results() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [resultsState, setResultsState] = useState({ loading: true, error: null, results: null });
  const [recsState, setRecsState] = useState({ loading: true, error: null, data: null });

  // Selection modal state
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [durationDays, setDurationDays] = useState(60);
  const [studyHours, setStudyHours] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);

  useEffect(() => {
    apiFetch(`/assessments/${assessmentId}/results`)
      .then(({ results }) => setResultsState({ loading: false, error: null, results }))
      .catch((err) => setResultsState({ loading: false, error: err.message, results: null }));

    apiFetch(`/assessments/${assessmentId}/career-recommendations`)
      .then((data) => setRecsState({ loading: false, error: null, data }))
      .catch((err) => setRecsState({ loading: false, error: err.message, data: null }));
  }, [assessmentId]);

  const handleSelectRoadmap = (career) => {
    setSelectedCareer(career);
    setGenerateError(null);
  };

  const handleConfirmGeneration = async () => {
    if (!selectedCareer) return;
    setGenerating(true);
    setGenerateError(null);

    try {
      const { csrfToken } = await apiFetch('/auth/csrf');
      const { roadmap } = await apiFetch('/roadmaps/generate', {
        method: 'POST',
        headers: { 'x-csrf-token': csrfToken },
        body: JSON.stringify({
          assessmentId: Number(assessmentId),
          learningPathId: selectedCareer.learningPathId,
          targetDurationDays: Number(durationDays),
          studyHoursPerWeek: Number(studyHours)
        })
      });
      navigate('/roadmap', { state: { selectedRoadmapId: roadmap.id } });
    } catch (err) {
      setGenerateError(err.message);
      setGenerating(false);
    }
  };

  if (resultsState.loading || recsState.loading) {
    return <div className="card text-center py-12 text-slate-500">Calculating your skill profile and analyzing career roadmaps...</div>;
  }

  if (resultsState.error) {
    return <div className="card text-center py-8"><Feedback error={resultsState.error} /></div>;
  }

  const { results } = resultsState;
  const recommendations = recsState.data?.recommendations || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
          <CheckCircle2 size={14} /> ASSESSMENT COMPLETE
        </span>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
          Your Verified Skill Profile & Career Options
        </h1>
        <p className="mt-2 text-slate-500">
          Scores are deterministically evaluated from your answers. Select one of the recommended career paths below to generate your tailored learning roadmap.
        </p>
      </div>

      {/* 3-5 Career Recommendations (Requirement 5) */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recommended Career Roadmaps</h2>
            <p className="text-sm text-slate-500">
              3–5 candidate paths matched to your domain and assessment evidence.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((career) => (
            <div key={career.careerId} className="card flex flex-col justify-between border-slate-200 hover:border-blue-300 transition shadow-sm">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                    {career.entryLevel}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> {career.estimatedDuration}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-bold text-slate-900">{career.careerTitle}</h3>
                <p className="mt-1 text-xs text-slate-600">{career.shortDescription}</p>

                <div className="mt-4 rounded-xl bg-blue-50/70 p-3 text-xs text-slate-700">
                  <span className="font-semibold text-blue-800">Why recommended: </span>
                  {career.whyRecommended}
                </div>

                {career.relevantStrengths?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-emerald-700">Relevant strengths:</p>
                    <ul className="mt-1 list-disc pl-4 text-xs text-slate-600">
                      {career.relevantStrengths.map((str) => <li key={str}>{str}</li>)}
                    </ul>
                  </div>
                )}

                {career.skillsToImprove?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-amber-700">Focus skills to build:</p>
                    <ul className="mt-1 list-disc pl-4 text-xs text-slate-600">
                      {career.skillsToImprove.map((sk) => <li key={sk}>{sk}</li>)}
                    </ul>
                  </div>
                )}

                {career.exampleProjects?.length > 0 && (
                  <div className="mt-3 border-t border-slate-100 pt-2">
                    <p className="text-xs font-semibold text-slate-700">Example project milestones:</p>
                    <p className="mt-1 text-xs text-slate-500 italic">"{career.exampleProjects[0]}"</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100">
                <Button className="w-full text-sm" onClick={() => handleSelectRoadmap(career)}>
                  Select This Roadmap →
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-400 text-center">
          {recsState.data?.disclaimer || 'Suitability is guidance based on the available assessment evidence, not a guarantee of employment or professional success.'}
        </p>
      </section>

      {/* Skill Scores Section */}
      <section className="card">
        <h2 className="text-xl font-bold text-slate-900">Demonstrated Skill Breakdown</h2>
        <p className="text-xs text-slate-500 mt-1">Based on verifiable answer accuracy from your submission.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {results?.skills?.map((skill) => (
            <div key={skill.skillId} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <strong className="text-sm font-bold text-slate-800">{skill.name}</strong>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                  {skill.score}% · {skill.band}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-200">
                <div
                  className={`h-2 rounded-full ${skill.score >= 70 ? 'bg-emerald-500' : skill.score >= 50 ? 'bg-blue-600' : 'bg-amber-500'}`}
                  style={{ width: `${skill.score}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">{skill.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap Configuration Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900">Customize Your Roadmap</h3>
            <p className="mt-1 text-sm text-slate-500">
              Generating learning roadmap for <span className="font-semibold text-blue-600">{selectedCareer.careerTitle}</span>
            </p>

            <div className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Target Roadmap Duration (Days)
                <select
                  className="field"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                >
                  <option value={30}>30 Days (Accelerated)</option>
                  <option value={60}>60 Days (Standard Pace)</option>
                  <option value={90}>90 Days (Thorough)</option>
                  <option value={180}>180 Days (Extended Deep-Dive)</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Study Hours Per Week
                <select
                  className="field"
                  value={studyHours}
                  onChange={(e) => setStudyHours(Number(e.target.value))}
                >
                  <option value={5}>5 Hours / week</option>
                  <option value={10}>10 Hours / week</option>
                  <option value={15}>15 Hours / week</option>
                  <option value={20}>20 Hours / week</option>
                </select>
              </label>

              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                <p>Total available study time: <strong>{Math.round(studyHours * durationDays / 7)} hours</strong></p>
                <p className="mt-1 text-slate-500">Estimated curriculum requirement: ~{selectedCareer.estimatedHours || 60} hours.</p>
              </div>

              {generateError && <Feedback error={generateError} />}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                disabled={generating}
                onClick={() => setSelectedCareer(null)}
              >
                Cancel
              </Button>
              <Button
                disabled={generating}
                onClick={handleConfirmGeneration}
              >
                {generating ? 'Generating roadmap...' : 'Generate Roadmap →'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Roadmap() {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, error: null, roadmaps: [], roadmap: null });
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const loadRoadmaps = async () => {
    try {
      const { roadmaps } = await apiFetch('/roadmaps');
      let activeRoadmap = null;
      const targetId = location.state?.selectedRoadmapId || roadmaps[0]?.id;
      if (targetId) {
        const { roadmap } = await apiFetch(`/roadmaps/${targetId}`);
        activeRoadmap = roadmap;
      }
      setState({ loading: false, error: null, roadmaps: roadmaps || [], roadmap: activeRoadmap });
    } catch (err) {
      setState({ loading: false, error: err.message, roadmaps: [], roadmap: null });
    }
  };

  useEffect(() => {
    loadRoadmaps();
  }, [location.state]);

  const openRoadmap = async (roadmapId) => {
    try {
      const { roadmap } = await apiFetch(`/roadmaps/${roadmapId}`);
      setState((current) => ({ ...current, roadmap }));
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }));
    }
  };

  const updateTask = async (taskId, status) => {
    setUpdatingTaskId(taskId);
    try {
      const { csrfToken } = await apiFetch('/auth/csrf');
      await apiFetch(`/roadmaps/${state.roadmap.id}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'x-csrf-token': csrfToken },
        body: JSON.stringify({ status })
      });
      await openRoadmap(state.roadmap.id);
    } catch (err) {
      setState((c) => ({ ...c, error: err.message }));
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (state.loading) return <div className="card text-center py-12 text-slate-500">Loading your roadmaps...</div>;

  if (!state.roadmap) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">No active roadmap yet</h2>
        <p className="mt-2 text-slate-500">Complete an assessment to choose a career and generate your learning roadmap.</p>
        <Link to="/onboarding" className="mt-6 inline-block"><Button>Start assessment →</Button></Link>
      </div>
    );
  }

  const { roadmap } = state;
  const completed = roadmap.completed_tasks || 0;
  const total = roadmap.total_tasks || 0;
  const progressPercent = total ? Math.round((completed / total) * 100) : 0;
  const recs = roadmap.ai_recommendations || {};

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">CAREER ROADMAP</span>
          <h1 className="text-3xl font-bold text-slate-900">{roadmap.career_title || roadmap.target_outcome}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {completed} of {total} milestones complete ({progressPercent}%) · {roadmap.target_duration_days} days target
          </p>
        </div>

        {state.roadmaps.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Switch roadmap:</span>
            <select
              className="field w-auto py-1.5 text-xs"
              value={roadmap.id}
              onChange={(e) => openRoadmap(e.target.value)}
            >
              {state.roadmaps.map((r) => (
                <option key={r.id} value={r.id}>{r.career_title || r.target_outcome}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-3 rounded-full bg-slate-200">
        <div className="h-3 rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* AI Personalization or Deterministic Notice */}
      {roadmap.ai_status === 'personalized' && recs.assessmentExplanation && (
        <section className="card bg-blue-50/50 border-blue-200">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase">
            <Sparkles size={14} /> AI Personalized Learning Plan
          </div>
          <p className="mt-2 text-sm text-slate-700">{recs.assessmentExplanation}</p>
          {recs.learningStrategies?.length > 0 && (
            <div className="mt-3">
              <span className="text-xs font-semibold text-slate-800">Key Strategies: </span>
              <span className="text-xs text-slate-600">{recs.learningStrategies.join(' · ')}</span>
            </div>
          )}
        </section>
      )}

      {roadmap.ai_status !== 'personalized' && (
        <div className="rounded-xl border border-blue-100 bg-white p-3 text-xs text-slate-600">
          Deterministic prerequisite-optimized curriculum active. (Gemini offline fallback).
        </div>
      )}

      {/* Phases and Tasks */}
      <div className="space-y-6">
        {roadmap.phases?.map((phase, pIdx) => (
          <section key={phase.id || pIdx} className="card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-blue-600">Phase {pIdx + 1}</span>
                <h2 className="text-lg font-bold text-slate-900">{phase.title}</h2>
                <p className="text-xs text-slate-500">{phase.objective}</p>
              </div>
              <span className="text-xs font-medium text-slate-500">Days {phase.startDay}–{phase.endDay}</span>
            </div>

            <div className="mt-4 space-y-3">
              {phase.tasks?.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-xl border p-4 transition ${
                    task.status === 'completed'
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {task.status === 'completed' && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                        <h3 className="font-semibold text-slate-900 text-sm">{task.title}</h3>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{task.learningObjective}</p>
                      {task.practiceInstructions && (
                        <p className="mt-1 text-xs text-slate-500 bg-slate-50 rounded p-2 border border-slate-100">
                          <strong>Practice:</strong> {task.practiceInstructions}
                        </p>
                      )}

                      {task.resources?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          {task.resources.map((res) => (
                            <a
                              key={res.id}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700 hover:bg-blue-100"
                            >
                              <BookOpen size={12} /> {res.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      <select
                        className="field w-auto py-1 text-xs font-medium"
                        value={task.status}
                        disabled={updatingTaskId === task.id}
                        onChange={(e) => updateTask(task.id, e.target.value)}
                      >
                        <option value="not_started">Not started</option>
                        <option value="in_progress">In progress</option>
                        <option value="completed">Completed ✓</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export function Dashboard() {
  const [state, setState] = useState({ loading: true, error: null, data: null, skills: [] });

  useEffect(() => {
    Promise.all([apiFetch('/progress/overview'), apiFetch('/progress/skills')])
      .then(([data, skillData]) => setState({ loading: false, error: null, data, skills: skillData.skills || [] }))
      .catch((err) => setState({ loading: false, error: err.message, data: null, skills: [] }));
  }, []);

  if (state.loading) return <div className="card text-center py-12 text-slate-500">Loading your dashboard...</div>;
  if (state.error) return <div className="card"><Feedback error={state.error} /></div>;

  const current = state.data?.current;
  if (!current) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">Your dashboard is ready</h2>
        <p className="mt-2 text-slate-500">Complete an assessment and select a career to generate your first roadmap.</p>
        <Link className="mt-6 inline-block" to="/onboarding"><Button>Start assessment →</Button></Link>
      </div>
    );
  }

  const progress = current.total_tasks ? Math.round((current.completed_tasks / current.total_tasks) * 100) : 0;
  const gaps = state.skills.filter((s) => Number(s.score) < 60).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">STUDENT DASHBOARD</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">{current.career_title || current.target_outcome}</h1>
        <p className="text-sm text-slate-500">{current.field_name} · {current.path_title || 'Career Roadmap'}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <p className="text-xs text-slate-500 font-medium">Roadmap progress</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{progress}%</p>
          <p className="mt-1 text-xs text-slate-400">{current.completed_tasks} of {current.total_tasks} milestones complete</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500 font-medium">Weekly target</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{current.study_hours_per_week || 5}h</p>
          <p className="mt-1 text-xs text-slate-400">planned weekly study time</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500 font-medium">Active tasks</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{current.active_tasks || 0}</p>
          <p className="mt-1 text-xs text-slate-400">currently in progress</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500 font-medium">Target duration</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{current.target_duration_days} days</p>
          <p className="mt-1 text-xs text-slate-400">estimated completion timeframe</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="text-lg font-bold text-slate-900">Next Recommended Task</h2>
          {current.next_task ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">{current.next_task.title}</h3>
              <p className="mt-1 text-xs text-slate-500">Days {current.next_task.start_day}–{current.next_task.end_day}</p>
              <Link className="mt-4 inline-block" to="/roadmap"><Button size="sm">Go to roadmap</Button></Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">All roadmap milestones are complete!</p>
          )}
        </section>

        <section className="card">
          <h2 className="text-lg font-bold text-slate-900">Priority Focus Areas</h2>
          {gaps.length ? (
            <div className="mt-4 space-y-3">
              {gaps.map((skill) => (
                <div key={skill.skill_id}>
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{skill.name}</span>
                    <span>{Math.round(skill.score)}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-slate-200">
                    <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${skill.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No major skill gaps recorded.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export function SkillProof() {
  const [state, setState] = useState({ loading: true, error: null, tasks: [], quiz: null, evidence: [], attempt: null });
  const [form, setForm] = useState({ skillId: '', title: '', description: '', sourceType: 'text', content: '', evidenceUrl: '' });
  const [selectedTask, setSelectedTask] = useState('');

  const load = async () => {
    try {
      const [{ roadmaps }, { evidence }] = await Promise.all([apiFetch('/roadmaps'), apiFetch('/skill-evidence')]);
      const tasks = [];
      for (const item of roadmaps) {
        const response = await apiFetch(`/roadmaps/${item.id}`);
        response.roadmap.phases.forEach((phase) => phase.tasks.forEach((task) => tasks.push({ ...task, roadmapTitle: response.roadmap.career_title || response.roadmap.target_outcome })));
      }
      setState({ loading: false, error: null, tasks, quiz: null, evidence: evidence || [] });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.message }));
    }
  };

  useEffect(() => { load(); }, []);

  const openQuiz = async (task) => {
    try {
      const { quiz } = await apiFetch(`/tasks/${task.id}/quiz-attempts`);
      setSelectedTask(String(task.id));
      setState((current) => ({ ...current, quiz, attempt: null }));
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }));
    }
  };

  const submitQuiz = async (event) => {
    event.preventDefault();
    const answers = [...event.currentTarget.querySelectorAll('[data-question]')].map((element) => ({
      questionId: Number(element.dataset.question),
      optionIds: [Number(element.value)]
    }));
    try {
      const csrf = await apiFetch('/auth/csrf');
      const { attempt } = await apiFetch(`/tasks/${selectedTask}/quiz-attempts`, {
        method: 'POST',
        headers: { 'x-csrf-token': csrf.csrfToken },
        body: JSON.stringify({ answers })
      });
      setState((current) => ({ ...current, attempt }));
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }));
    }
  };

  const submitEvidence = async (event) => {
    event.preventDefault();
    try {
      const csrf = await apiFetch('/auth/csrf');
      await apiFetch('/skill-evidence', {
        method: 'POST',
        headers: { 'x-csrf-token': csrf.csrfToken },
        body: JSON.stringify({ ...form, skillId: Number(form.skillId) })
      });
      setForm({ skillId: '', title: '', description: '', sourceType: 'text', content: '', evidenceUrl: '' });
      await load();
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }));
    }
  };

  if (state.loading) return <div className="card text-center py-12 text-slate-500">Loading SkillProof...</div>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">SKILLPROOF VERIFICATION</p>
        <h1 className="text-3xl font-bold text-slate-900">Verify mastery with evidence.</h1>
        <p className="mt-1 text-sm text-slate-500">Pass task quizzes and submit practical projects to solidify validated competencies.</p>
      </div>

      <Feedback error={state.error} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="text-lg font-bold text-slate-900">Task Quizzes</h2>
          <div className="mt-4 space-y-3">
            {state.tasks.filter((t) => t.status !== 'completed').slice(0, 6).map((task) => (
              <div key={task.id} className="rounded-xl border border-slate-200 p-3.5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                  <p className="text-xs text-slate-500">{task.roadmapTitle}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => openQuiz(task)}>Take quiz</Button>
              </div>
            ))}
            {!state.tasks.length && <p className="text-sm text-slate-400">Generate a roadmap to unlock task quizzes.</p>}
          </div>

          {state.quiz && (
            <form className="mt-6 border-t border-slate-200 pt-5 space-y-4" onSubmit={submitQuiz}>
              <h3 className="font-bold text-slate-900">{state.quiz.title}</h3>
              {state.quiz.questions.map((q) => (
                <label key={q.questionId} className="block text-sm font-medium text-slate-700">
                  {q.prompt}
                  <select className="field mt-1" data-question={q.questionId} required defaultValue="">
                    <option value="">Select answer</option>
                    {q.options.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                  </select>
                </label>
              ))}
              <Button type="submit">Submit quiz answers</Button>
              {state.attempt && (
                <p className={`text-sm font-semibold ${state.attempt.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {state.attempt.feedback} (Score: {state.attempt.score}%)
                </p>
              )}
            </form>
          )}
        </section>

        <section className="card">
          <h2 className="text-lg font-bold text-slate-900">Submit Project Evidence</h2>
          <form className="mt-4 space-y-3" onSubmit={submitEvidence}>
            <label className="block text-xs font-medium text-slate-700">
              Skill ID
              <input className="field mt-1" type="number" min="1" value={form.skillId} onChange={(e) => setForm({ ...form, skillId: e.target.value })} required />
            </label>
            <label className="block text-xs font-medium text-slate-700">
              Evidence Title
              <input className="field mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="E.g. GitHub Repository link or design spec" required />
            </label>
            <label className="block text-xs font-medium text-slate-700">
              Description
              <textarea className="field mt-1" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </label>
            <label className="block text-xs font-medium text-slate-700">
              Evidence Type
              <select className="field mt-1" value={form.sourceType} onChange={(e) => setForm({ ...form, sourceType: e.target.value })}>
                <option value="text">Written reflection / summary</option>
                <option value="url">Project URL (GitHub / Demo)</option>
              </select>
            </label>
            {form.sourceType === 'text' ? (
              <label className="block text-xs font-medium text-slate-700">
                Detailed Content
                <textarea className="field mt-1" rows="3" minLength="20" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
              </label>
            ) : (
              <label className="block text-xs font-medium text-slate-700">
                Live URL
                <input className="field mt-1" type="url" value={form.evidenceUrl} onChange={(e) => setForm({ ...form, evidenceUrl: e.target.value })} placeholder="https://..." required />
              </label>
            )}
            <Button type="submit">Submit for review</Button>
          </form>

          {state.evidence.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase">Recent Submissions</h3>
              <div className="mt-2 space-y-2">
                {state.evidence.map((ev) => (
                  <div key={ev.id} className="text-xs flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-medium text-slate-800">{ev.title}</span>
                    <span className="text-blue-600 font-semibold">{ev.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export function Profile() {
  const [state, setState] = useState({ loading: true, error: null, skills: [] });

  useEffect(() => {
    apiFetch('/progress/skills')
      .then(({ skills }) => setState({ loading: false, error: null, skills: skills || [] }))
      .catch((err) => setState({ loading: false, error: err.message, skills: [] }));
  }, []);

  if (state.loading) return <div className="card text-center py-12 text-slate-500">Loading your profile...</div>;
  if (state.error) return <div className="card"><Feedback error={state.error} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">PORTFOLIO</p>
        <h1 className="text-3xl font-bold text-slate-900">Your Demonstrated Skills</h1>
        <p className="mt-1 text-sm text-slate-500">Diagnostic assessments, quizzes, and project evidence contribute to your verified scores.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {state.skills.map((skill) => (
          <div key={skill.skill_id} className="card">
            <div className="flex items-center justify-between">
              <strong className="text-base font-bold text-slate-900">{skill.name}</strong>
              <span className="text-sm font-semibold text-blue-600">{Math.round(skill.score)}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-blue-600" style={{ width: `${skill.score}%` }} />
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Source: {skill.source} · {skill.passed_quizzes || 0} passed quizzes · {skill.verified_evidence || 0} verified projects
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Placeholder({ title, description }) {
  return (
    <div className="card text-center py-12">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-500">{description}</p>
      <Link to="/onboarding" className="mt-6 inline-block"><Button>Back to Learning</Button></Link>
    </div>
  );
}
