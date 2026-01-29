'use client';

import React, { useState } from 'react';
import { Upload, Loader2, XCircle } from 'lucide-react';

import { useAuth } from '@/app/context/AuthContext';
import Toast from '@/app/Components/Toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const NewJobPage = ({ onNavigate }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const { user } = useAuth();

  const handleFiles = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter((file) => {
      const isValid =
        file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/');
      if (!isValid) {
        setToast({
          message: `${file.name} is invalid (max 5MB, images only)`,
          type: 'error',
        });
      }
      return isValid;
    });

    if (files.length + validFiles.length > 100) {
      setToast({ message: 'Maximum 100 images allowed', type: 'error' });
      return;
    }

    setFiles([...files, ...validFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setToast({ message: 'Please select at least one image', type: 'error' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      setToast({ message: 'Job created successfully!', type: 'success' });
      setTimeout(() => onNavigate('dashboard'), 1500);
    } catch (err) {
      setToast({ message: 'Failed to create job', type: 'error' });
    } finally {
      setUploading(false);
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

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Job
            </h1>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag & Drop */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag and drop images here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <label className="cursor-pointer">
                <span className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
                  Browse Files
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-4">
                Max 100 images, 5MB per file
              </p>
            </div>

            {/* Preview */}
            {files.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Selected Images ({files.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={uploading || files.length === 0}
              className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Job...
                </>
              ) : (
                'Create Job'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewJobPage;
