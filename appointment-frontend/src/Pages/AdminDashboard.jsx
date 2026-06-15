import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [tab, setTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([API.get('/admin/users'), API.get('/admin/appointments'), API.get('/admin/providers')])
      .then(([u, a, p]) => { setUsers(u.data); setAppointments(a.data); setProviders(p.data); });
  }, []);

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const deleteUser = async (id) => {
  if (!window.confirm("Delete this user?")) return;

  try {
    await API.delete(`/admin/user/${id}`);

    const res = await API.get('/admin/users');
    setUsers(res.data);
  } catch (err) {
    alert("Unable to delete user");
  }
};

const deleteDoctor = async (id) => {
  if (!window.confirm("Delete this doctor?")) return;

  try {
    await API.delete(`/admin/provider/${id}`);

    const res = await API.get('/admin/providers');
    setProviders(res.data);
  } catch (err) {
    alert("Unable to delete doctor");
  }
};

  const stats = [
    { label: 'Total Users', value: users.length, icon: '👥', color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Appointments', value: appointments.length, icon: '📋', color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Doctors', value: providers.length, icon: '👨‍⚕️', color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, icon: '✅', color: '#0891b2', bg: '#ecfeff' },
  ];

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'users', label: '👥 Users' },
    { key: 'appointments', label: '📋 Appointments' },
    { key: 'providers', label: '👨‍⚕️ Doctors' },
  ];

  const thStyle = { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' };
  const tdStyle = { padding: '14px 16px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f1f5f9' };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f1f5f9', fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}>

      {/* Sidebar */}
      <div style={{ width: '240px', background: 'linear-gradient(180deg, #1e1b4b, #312e81)', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '26px', marginBottom: '4px' }}>🏥</div>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '18px' }}>MediBook</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Admin Panel</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ width: '100%', padding: '12px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer', marginBottom: '4px', textAlign: 'left', fontSize: '14px', fontWeight: '600', background: tab === t.key ? 'rgba(255,255,255,0.15)' : 'transparent', color: tab === t.key ? 'white' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={logout}
            style={{ width: '100%', padding: '11px', background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: 'white', padding: '18px 28px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1e293b' }}>
              {tabs.find(t => t.key === tab)?.label}
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Manage your platform</p>
          </div>
          <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
            ⚙️ Super Admin
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>

          {tab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
                {stats.map(s => (
                  <div key={s.label} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: '30px', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
                      <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontSize: '16px', fontWeight: '700' }}>Recent Appointments</h3>
                  {appointments.slice(0, 5).map(a => (
                    <div key={a.appointmentId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#374151', fontSize: '14px' }}>{a.user?.fullName} → {a.provider?.fullName}</span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: a.status === 'confirmed' ? '#16a34a' : '#d97706' }}>{a.status}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontSize: '16px', fontWeight: '700' }}>User Roles</h3>
                  {['patient', 'provider', 'admin'].map(role => {
                    const count = users.filter(u => u.role === role).length;
                    return (
                      <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#374151', fontSize: '14px', textTransform: 'capitalize' }}>{role === 'patient' ? '🧑‍💼' : role === 'provider' ? '👨‍⚕️' : '⚙️'} {role}</span>
                        <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['ID', 'Name', 'Email', 'Phone', 'Role', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.userId} style={{ transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={tdStyle}>{u.userId}</td>
                      <td style={{ ...tdStyle, fontWeight: '600', color: '#1e293b' }}>{u.fullName}</td>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>{u.phone}</td>
                      <td style={tdStyle}>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: u.role === 'admin' ? '#fef2f2' : u.role === 'provider' ? '#f0fdf4' : '#eff6ff', color: u.role === 'admin' ? '#dc2626' : u.role === 'provider' ? '#16a34a' : '#3b82f6' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={tdStyle}>
  <button
    onClick={() => deleteUser(u.userId)}
    style={{
      background: '#ef4444',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '8px',
      cursor: 'pointer'
    }}
  >
    🗑 Delete
  </button>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'appointments' && (
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['ID', 'Patient', 'Doctor', 'Status', 'Notes'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.appointmentId} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={tdStyle}>{a.appointmentId}</td>
                      <td style={{ ...tdStyle, fontWeight: '600', color: '#1e293b' }}>{a.user?.fullName}</td>
                      <td style={tdStyle}>{a.provider?.fullName}</td>
                      <td style={tdStyle}>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: a.status === 'cancelled' ? '#fef2f2' : '#f0fdf4', color: a.status === 'cancelled' ? '#dc2626' : '#16a34a' }}>
                          {a.status}
                        </span>
                      </td>
                      <td style={tdStyle}>{a.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'providers' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {providers.map(p => (
                <div key={p.providerId} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>👨‍⚕️</div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '16px' }}>{p.fullName}</div>
                      <div style={{ color: '#7c3aed', fontSize: '13px' }}>{p.specialization || 'General'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                      {p.available ? '✅ Active' : '❌ Inactive'}
                    </span>
                    <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                      📍 {p.location || 'Hospital'}
                    </span>
                    <button
  onClick={() => deleteDoctor(p.providerId)}
  style={{
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700'
  }}
>
  🗑 Delete
</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;