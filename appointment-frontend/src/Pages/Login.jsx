import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');
  const navigate = useNavigate();

  const roles = [
    { key: 'patient', icon: '🧑‍💼', label: 'Patient', color: '#4f46e5' },
    { key: 'provider', icon: '👨‍⚕️', label: 'Doctor', color: '#059669' },
    { key: 'admin', icon: '⚙️', label: 'Admin', color: '#dc2626' },
  ];

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill all fields'); return; }
    setLoading(true); setError('');
    try {
      const res = await API.post('/login', { email, password });
      if (res.data.status === 'success') {
        if (res.data.role !== selectedRole) {
          setError(`You are a ${res.data.role}, not a ${selectedRole}!`);
          setLoading(false); return;
        }
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('name', res.data.name);
        if (res.data.role === 'admin') navigate('/admin');
        else if (res.data.role === 'provider') navigate('/doctor');
        else navigate('/patient');
      } else { setError(res.data.message); }
    } catch { setError('Cannot connect to server!'); }
    setLoading(false);
  };

  const active = roles.find(r => r.key === selectedRole);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* Left Panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background circles */}
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: '-100px', left: '-100px' }} />
        <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', bottom: '-50px', right: '-50px' }} />
        
        <div style={{ position: 'relative', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏥</div>
          <h1 style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 12px', letterSpacing: '-1px' }}>MediBook</h1>
          <p style={{ fontSize: '18px', opacity: 0.85, margin: '0 0 40px', lineHeight: 1.6 }}>Your trusted appointment<br />booking platform</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            {['Book appointments instantly', 'Manage your health records', 'Connect with top doctors'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>✓</div>
                <span style={{ fontSize: '15px', opacity: 0.9 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: '480px', background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 50px', overflowY: 'auto' }}>
        
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 6px' }}>Welcome back 👋</h2>
        <p style={{ color: '#64748b', fontSize: '15px', margin: '0 0 32px' }}>Sign in to your account</p>

        {/* Role Selection */}
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Login as</p>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
          {roles.map(r => (
            <button key={r.key} onClick={() => setSelectedRole(r.key)}
              style={{ flex: 1, padding: '14px 8px', border: `2px solid ${selectedRole === r.key ? r.color : '#e2e8f0'}`, borderRadius: '12px', cursor: 'pointer', background: selectedRole === r.key ? r.color + '10' : 'white', color: selectedRole === r.key ? r.color : '#94a3b8', fontWeight: '700', fontSize: '12px', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{r.icon}</div>
              {r.label}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email Address</label>
          <input
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: '100%', padding: '13px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', background: 'white', boxSizing: 'border-box', color: '#1e293b' }}
            onFocus={e => e.target.style.borderColor = active.color}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter your password"
            style={{ width: '100%', padding: '13px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', background: 'white', boxSizing: 'border-box', color: '#1e293b' }}
            onFocus={e => e.target.style.borderColor = active.color}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <button onClick={handleLogin} disabled={loading}
          style={{ width: '100%', padding: '15px', background: `linear-gradient(135deg, ${active.color}, ${active.color}cc)`, color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginBottom: '20px', boxShadow: `0 4px 15px ${active.color}40` }}>
          {loading ? '⏳ Signing in...' : `Sign in as ${active.label}`}
        </button>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
          No account? <Link to="/register" style={{ color: active.color, fontWeight: '700', textDecoration: 'none' }}>Create one free</Link>
        </p>

        <div style={{ marginTop: '32px', padding: '16px', background: '#f1f5f9', borderRadius: '10px', fontSize: '12px', color: '#64748b' }}>
          <strong style={{ color: '#475569' }}>Quick Access:</strong><br />
          👨‍⚕️ Doctor: rahul@booking.com / rahul123<br />
          ⚙️ Admin: admin@booking.com / admin123<br />
          🧑‍💼 Patient: Register or use ayush@gmail.com
        </div>
      </div>
    </div>
  );
}

export default Login;