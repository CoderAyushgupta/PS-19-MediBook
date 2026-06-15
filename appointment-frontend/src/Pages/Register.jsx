import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.password || !form.phone) { setMsg('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await API.post('/register', form);
      if (res.data.status === 'success') {
        setMsg('✅ Account created! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else { setMsg(res.data.message); }
    } catch { setMsg('Something went wrong!'); }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: "'Segoe UI', sans-serif" }}>
      
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🩺</div>
          <h1 style={{ fontSize: '38px', fontWeight: '800', margin: '0 0 12px' }}>Join MediBook</h1>
          <p style={{ fontSize: '17px', opacity: 0.85, lineHeight: 1.6 }}>Create your account and start<br />booking appointments today</p>
        </div>
      </div>

      <div style={{ width: '480px', background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 50px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 6px' }}>Create Account</h2>
        <p style={{ color: '#64748b', fontSize: '15px', margin: '0 0 32px' }}>Fill in your details to get started</p>

        {msg && (
          <div style={{ background: msg.includes('✅') ? '#f0fdf4' : '#fef2f2', border: `1px solid ${msg.includes('✅') ? '#bbf7d0' : '#fecaca'}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: msg.includes('✅') ? '#16a34a' : '#dc2626', fontSize: '14px' }}>
            {msg}
          </div>
        )}

        {[
          { label: 'Full Name', key: 'fullName', placeholder: 'Dr. John Doe', type: 'text' },
          { label: 'Email Address', key: 'email', placeholder: 'you@example.com', type: 'email' },
          { label: 'Phone Number', key: 'phone', placeholder: '+91 98765 43210', type: 'tel' },
          { label: 'Password', key: 'password', placeholder: 'Min 6 characters', type: 'password' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{f.label}</label>
            <input
              type={f.type} value={form[f.key]} placeholder={f.placeholder}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              style={{ width: '100%', padding: '13px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', background: 'white', boxSizing: 'border-box', color: '#1e293b' }}
              onFocus={e => e.target.style.borderColor = '#11998e'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
        ))}

        <button onClick={handleRegister} disabled={loading}
          style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #11998e, #38ef7d)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px', boxShadow: '0 4px 15px rgba(17,153,142,0.4)' }}>
          {loading ? '⏳ Creating...' : '🚀 Create Account'}
        </button>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginTop: '20px' }}>
          Already have an account? <Link to="/login" style={{ color: '#11998e', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;