'use client'
import React, { useState, useEffect } from 'react';
import {
  LogOut,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Trash2,
  Briefcase,
  Plus
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import Toast from '@/app/Components/Toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Dashboard = ({ onNavigate }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { user, signout } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch {
      setToast({ message: 'Failed to load jobs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) throw new Error();
      setJobs(jobs.filter(job => job.job_id !== jobId));
      setToast({ message: 'Job deleted successfully', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete job', type: 'error' });
    }
  };

  // 🔽 Direct download via FastAPI redirect
  const downloadReport = async (jobId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/jobs/${jobId}/report`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        redirect: 'follow',
      }
    );

    if (!response.ok) throw new Error();

    // browser will auto-handle the redirect + download
    window.location.href = response.url;

  } catch {
    setToast({ message: 'Report not available', type: 'error' });
  }
};

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DONE':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'QUEUED':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'PROGRESSED':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DONE':
        return 'bg-green-100 text-green-700';
      case 'QUEUED':
        return 'bg-yellow-100 text-yellow-700';
      case 'PROGRESSED':
        return 'bg-blue-100 text-blue-700';
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Job Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('newjob')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Job
            </button>
            <button
              onClick={signout}
              className="px-4 py-2 text-gray-700 hover:text-red-600 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-xl animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">No jobs yet</h3>
            <button
              onClick={() => onNavigate('newjob')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Create Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div
                key={job.job_id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Job #{job.job_id}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusIcon(job.status)}
                </div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getStatusBadge(
                    job.status
                  )}`}
                >
                  {job.status}
                </span>

                <div className="flex gap-2">
                  {job.status === 'DONE' && (
                    <button
                      onClick={() => downloadReport(job.job_id)}
                      className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center justify-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      Download
                    </button>
                  )}

                  <button
                    onClick={() => deleteJob(job.job_id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
