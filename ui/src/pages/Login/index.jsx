import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, user, loading: authLoading, error: authError } = useAuth();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(identifier, password);
      
      // Redirect based on backend role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/dashboard'); // default to student dashboard
      }
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <main className="w-full max-w-[440px] z-10">
        {/* Brand Identity Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-3xl" id="brand-logo">account_balance</span>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Shree Gujrati Samaj College</h1>
          <p className="text-on-surface-variant font-medium tracking-wide text-sm uppercase">Heritage Meets Innovation</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_12px_32px_rgba(25,28,29,0.04)]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface">Institution Login</h2>
            <p className="text-on-surface-variant text-sm mt-1">Please enter your credentials to access the portal.</p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 text-[20px]">error</span>
              <div>{authError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Roll Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1" htmlFor="identifier">Email or Roll Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors" id="id-icon">person</span>
                </div>
                <input 
                  className="w-full bg-surface-container-low border-0 rounded-lg pl-12 pr-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all" 
                  id="identifier" 
                  placeholder="e.g. STU10293 or name@institution.edu" 
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="password">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors" id="lock-icon">lock</span>
                </div>
                <input 
                  className="w-full bg-surface-container-low border-0 rounded-lg pl-12 pr-12 py-3.5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Login CTA */}
            <div className="pt-2">
              <button 
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                type="submit"
                disabled={authLoading}
              >
                {authLoading ? 'Authenticating...' : 'Login to Dashboard'}
                {!authLoading && <span className="material-symbols-outlined" id="login-arrow">arrow_forward</span>}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <Link 
              to="/forgot-password"
              className="font-semibold text-primary hover:text-primary-container transition-colors inline-flex items-center gap-1 group"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Trust Indicator */}
        <div className="mt-12 flex flex-col items-center justify-center space-y-4 opacity-60">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}} id="secure-icon">verified_user</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}} id="iso-icon">security</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">ISO 27001 Certified</span>
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant font-medium">© 2026 Shree Gujrati Samaj College. All rights reserved.</p>
        </div>
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" id="bg-blob-1"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-secondary-container/10 rounded-full blur-[80px]" id="bg-blob-2"></div>
      </div>
    </div>
  );
};

export default Login;
