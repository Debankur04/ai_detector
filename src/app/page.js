'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { useAuth } from './context/AuthContext';

import Dashboard from './Components/Dashboard';
import NewJobPage from './Components/NewJobPage';
import SignInPage from './Components/SignInPage';
import SignUpPage from './Components/SignUpPage';
import LandingPage from './Components/LandingPage';

const App = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');

  useEffect(() => {
    if (!loading) {
      if (user && currentPage === 'landing') {
        setCurrentPage('dashboard');
      } else if (
        !user &&
        !['landing', 'signin', 'signup'].includes(currentPage)
      ) {
        setCurrentPage('landing');
      }
    }
  }, [user, loading, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage onNavigate={setCurrentPage} />
      )}
      {currentPage === 'signin' && (
        <SignInPage onNavigate={setCurrentPage} />
      )}
      {currentPage === 'signup' && (
        <SignUpPage onNavigate={setCurrentPage} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard onNavigate={setCurrentPage} />
      )}
      {currentPage === 'newjob' && (
        <NewJobPage onNavigate={setCurrentPage} />
      )}
    </>
  );
};

export default App;
