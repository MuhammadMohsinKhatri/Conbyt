import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEnvelope, FaUser, FaCalendar, FaPhone, FaArrowLeft } from 'react-icons/fa';
import { useToast } from '../../contexts/ToastContext';

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('cms_token');
    if (!token) {
      navigate('/cms/login');
      return;
    }
    fetchSubmissions();
  }, [navigate]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('cms_token');
      const { fetchAdminContact } = await import('../../utils/api.js');
      const data = await fetchAdminContact(token);
      setSubmissions(data);
    } catch (error) {
      if (error.message && (error.message.includes('401') || error.message.includes('Token'))) {
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_user');
        toast.error('Session expired. Please log in again.');
        navigate('/cms/login');
        return;
      }
      const errorMsg = 'Failed to fetch contact submissions';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      const token = localStorage.getItem('cms_token');
      const { deleteAdminContact } = await import('../../utils/api.js');
      await deleteAdminContact(id, token);
      setSubmissions(submissions.filter(sub => sub.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
      toast.success('Contact submission deleted successfully');
    } catch (error) {
      toast.error('Error deleting submission: ' + (error.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-surface border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/cms/dashboard')}
              className="text-white/60 hover:text-white transition"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <FaEnvelope className="text-accent text-2xl" />
            <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
          </div>
          <div className="text-white/60">
            {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="bg-surface rounded-xl p-12 text-center">
            <FaEnvelope className="text-white/30 text-6xl mx-auto mb-4" />
            <p className="text-white/70 text-lg">No contact submissions yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Submissions List */}
            <div className="lg:col-span-1 space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className={`bg-surface rounded-xl p-4 border cursor-pointer transition ${
                    selectedSubmission?.id === submission.id
                      ? 'border-accent bg-accent/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-accent" />
                      <span className="text-white font-semibold">{submission.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(submission.id);
                      }}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <p className="text-white/80 text-sm mb-2 line-clamp-2">{submission.subject}</p>
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                      <FaEnvelope />
                      <span className="truncate max-w-[150px]">{submission.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCalendar />
                      <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submission Details */}
            <div className="lg:col-span-2">
              {selectedSubmission ? (
                <div className="bg-surface rounded-xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Submission Details</h2>
                    <button
                      onClick={() => handleDelete(selectedSubmission.id)}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition"
                    >
                      <FaTrash className="inline mr-2" /> Delete
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-white/60 text-sm font-medium">Name</label>
                      <div className="flex items-center gap-2 mt-1">
                        <FaUser className="text-accent" />
                        <p className="text-white text-lg">{selectedSubmission.name}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-white/60 text-sm font-medium">Email</label>
                      <div className="flex items-center gap-2 mt-1">
                        <FaEnvelope className="text-accent" />
                        <a
                          href={`mailto:${selectedSubmission.email}`}
                          className="text-accent hover:text-accent2 transition"
                        >
                          {selectedSubmission.email}
                        </a>
                      </div>
                    </div>

                    {selectedSubmission.phone && (
                      <div>
                        <label className="text-white/60 text-sm font-medium">Phone</label>
                        <div className="flex items-center gap-2 mt-1">
                          <FaPhone className="text-accent" />
                          <a
                            href={`tel:${selectedSubmission.phone}`}
                            className="text-white hover:text-accent transition"
                          >
                            {selectedSubmission.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-white/60 text-sm font-medium">Subject</label>
                      <p className="text-white text-lg mt-1">{selectedSubmission.subject}</p>
                    </div>

                    <div>
                      <label className="text-white/60 text-sm font-medium">Message</label>
                      <div className="mt-2 p-4 bg-primary/40 rounded-lg">
                        <p className="text-white whitespace-pre-wrap">{selectedSubmission.message}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-white/60 text-sm font-medium">Submitted</label>
                      <div className="flex items-center gap-2 mt-1">
                        <FaCalendar className="text-accent" />
                        <p className="text-white">
                          {new Date(selectedSubmission.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-surface rounded-xl p-12 text-center border border-white/10">
                  <FaEnvelope className="text-white/30 text-6xl mx-auto mb-4" />
                  <p className="text-white/70">Select a submission to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContactSubmissions;

