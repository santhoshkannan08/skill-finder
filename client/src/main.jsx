import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { Auth, Assessment, Dashboard, Landing, Onboarding, Placeholder, Profile, Results, Roadmap, SkillProof } from './pages/Pages';
import { AppProvider } from './context/AppContext.jsx';
import './index.css';

function App() {
  return <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Auth mode="login" />} />
    <Route path="/register" element={<Auth mode="register" />} />
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/results/:assessmentId" element={<Results />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/skillproof" element={<SkillProof />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
    <Route path="*" element={<Placeholder title="Page not found" description="The requested page does not exist." />} />
  </Routes>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><AppProvider><BrowserRouter><App /></BrowserRouter></AppProvider></React.StrictMode>);
