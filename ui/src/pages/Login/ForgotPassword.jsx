import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await api.post('/auth/password/reset-request/', { identifier });
      setStatus({
        type: 'success',
        message: response.data?.message || 'If an account exists, a recovery link has been sent.'
      });
      setIdentifier('');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || 'Unable to process your request right now.';
      setStatus({ type: 'error', message: typeof msg === 'string' ? msg : JSON.stringify(msg) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8 font-body">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-[48px] p-12 lg:p-16 shadow-[0_32px_128px_rgba(25,28,29,0.08)] border border-slate-50">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/5 text-primary rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <span className="material-symbols-outlined text-4xl">key_off</span>
          </div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-2">Recover Access</h2>
          <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
            Enter your institutional identifier to receive a recovery link via secure transit.
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="recovery-id">Institutional Email / Roll No.</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">alternate_email</span>
              </div>
              <input 
                id="recovery-id"
                type="text" 
                placeholder="e.g. STU10293 or name@institution.edu" 
                required
                className="w-full bg-slate-50 border-0 rounded-2xl pl-12 pr-4 py-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          {status.message && (
            <div className={`p-3 rounded-xl text-xs font-bold ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {status.message}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {loading ? 'Processing...' : 'Send Recovery Hash'}
            {!loading && <span className="material-symbols-outlined text-lg">send</span>}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
          >
            Back to Secure Login
          </button>
        </div>

        <p className="mt-10 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">
          Protocol Entropy Level: High
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
