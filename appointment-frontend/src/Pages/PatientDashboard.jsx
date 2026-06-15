import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function PatientDashboard() {
  const [providers, setProviders] = useState([]);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedProviderName, setSelectedProviderName] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('book');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const name = localStorage.getItem('name');

  useEffect(() => { loadProviders(); loadAppointments(); }, []);

  const loadProviders = async () => { try { const r = await API.get('/providers'); setProviders(r.data); } catch {} };
  const loadAppointments = async () => { try { const r = await API.get(`/my-appointments/${userId}`); setAppointments(r.data); } catch {} };

  const loadSlots = async (pid, pname) => {
    setSelectedProvider(pid); setSelectedProviderName(pname); setSlots([]);
    try { const r = await API.get(`/slots/${pid}`); setSlots(r.data); setActiveTab('slots'); } catch {}
  };

  const bookSlot = async (slotId) => {
    try {
      const r = await API.post('/book', { userId: parseInt(userId), slotId: parseInt(slotId), notes: notes || '' });
      setMsg({ text: r.data.message, type: r.data.status });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      loadSlots(selectedProvider, selectedProviderName);
      loadAppointments();
    } catch { setMsg({ text: 'Booking failed!', type: 'error' }); }
  };

  const cancelAppointment = async (id) => {
    try { await API.delete(`/cancel/${id}`); loadAppointments(); setMsg({ text: 'Appointment cancelled.', type: 'success' }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); } catch {}
  };

  const searchProviders = async () => {
    if (!searchQuery.trim()) return;
    try { const r = await fetch(`http://localhost:7000/search?q=${searchQuery}`); const d = await r.json(); setSearchResults(d.results); } catch {}
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const tabs = [
    { key: 'book', label: '🏥 Find Doctors' },
    { key: 'slots', label: '📅 Slots' },
    { key: 'appointments', label: `📋 My Bookings (${appointments.length})` },
    { key: 'search', label: '🔍 Smart Search' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', background: '#f1f5f9', fontFamily: "'Segoe UI', sans-serif", boxSizing: 'border-box' }}>

      {/* Top Nav */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🏥</span>
          <div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '18px', lineHeight: 1 }}>MediBook</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Patient Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: 'white', fontSize: '14px' }}>👋 {name}</div>
          <button onClick={logout} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', gap: '4px' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === t.key ? '700' : '500', color: activeTab === t.key ? '#3b82f6' : '#64748b', borderBottom: activeTab === t.key ? '3px solid #3b82f6' : '3px solid transparent', transition: 'all 0.2s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Alert */}
      {msg.text && (
        <div style={{ margin: '16px 32px 0', padding: '14px 20px', borderRadius: '10px', background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, color: msg.type === 'success' ? '#16a34a' : '#dc2626', fontWeight: '600', fontSize: '14px' }}>
          {msg.type === 'success' ? '✅' : '❌'} {msg.text}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, padding: '24px 32px' }}>

        {/* FIND DOCTORS TAB */}
        {activeTab === 'book' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px' }}>Available Doctors</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {providers.map(p => (
                <div key={p.providerId} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,0.08)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>👨‍⚕️</div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '16px' }}>{p.fullName}</div>
                      <div style={{ color: '#6366f1', fontSize: '13px', fontWeight: '600' }}>{p.specialization || 'General Consultation'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
                    📍 {p.location || 'Main Hospital'}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>✅ Available</span>
                    <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>⭐ Top Rated</span>
                  </div>
                  <button onClick={() => loadSlots(p.providerId, p.fullName)}
                    style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                    View Available Slots →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SLOTS TAB */}
        {activeTab === 'slots' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 6px' }}>
              Available Slots {selectedProviderName && `— ${selectedProviderName}`}
            </h2>
            {!selectedProvider ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>👆</div>
                <p style={{ fontSize: '16px' }}>Go to "Find Doctors" and click "View Available Slots"</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <input value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="📝 Add notes for the doctor (optional)"
                    style={{ width: '100%', maxWidth: '500px', padding: '13px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                {slots.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '50px', marginBottom: '12px' }}>📭</div>
                    <p>No available slots for this doctor</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {slots.map(s => (
                      <div key={s.slotId} style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', marginBottom: '10px' }}>🗓️</div>
                        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px', marginBottom: '4px' }}>
                          {new Date(s.slotTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div style={{ color: '#3b82f6', fontWeight: '600', fontSize: '18px', marginBottom: '14px' }}>
                          {new Date(s.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <button onClick={() => bookSlot(s.slotId)}
                          style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* MY APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px' }}>My Appointments</h2>
            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '16px', color: '#94a3b8' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
                <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px', color: '#475569' }}>No appointments yet</p>
                <p>Go to "Find Doctors" to book your first appointment</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {appointments.map(a => (
                  <div key={a.appointmentId} style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👨‍⚕️</div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '16px' }}>{a.provider?.fullName}</div>
                        <div style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>📝 {a.notes || 'No notes added'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', background: a.status === 'cancelled' ? '#fef2f2' : a.status === 'confirmed' ? '#f0fdf4' : '#fffbeb', color: a.status === 'cancelled' ? '#dc2626' : a.status === 'confirmed' ? '#16a34a' : '#d97706' }}>
                        {a.status === 'cancelled' ? '❌' : a.status === 'confirmed' ? '✅' : '⏳'} {a.status?.toUpperCase()}
                      </span>
                      {a.status !== 'cancelled' && (
                        <button onClick={() => cancelAppointment(a.appointmentId)}
                          style={{ padding: '8px 16px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SMART SEARCH TAB */}
        {activeTab === 'search' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 6px' }}>🔍 Smart Search</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 20px' }}>Powered by MongoDB — search by name, specialization or location</p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', maxWidth: '600px' }}>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchProviders()}
                placeholder='Try: "skin", "general", "Block A", "rahul"...'
                style={{ flex: 1, padding: '14px 18px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button onClick={searchProviders}
                style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                Search
              </button>
            </div>

            {/* Search Chips */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {['skin', 'general', 'rahul', 'priya', 'Block A', 'Block B'].map(q => (
                <button key={q} onClick={() => { setSearchQuery(q); searchProviders(); }}
                  style={{ padding: '6px 14px', border: '1px solid #c7d2fe', borderRadius: '20px', background: '#eff6ff', color: '#4f46e5', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                  {q}
                </button>
              ))}
            </div>

            {searchResults.length > 0 && (
              <div>
                <p style={{ fontSize: '14px', color: '#16a34a', fontWeight: '600', marginBottom: '16px' }}>✅ {searchResults.length} result(s) found</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                  {searchResults.map(r => (
                    <div key={r.providerId} style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '2px solid #c7d2fe', cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => { loadSlots(r.providerId, r.fullName); setSearchResults([]); setSearchQuery(''); }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👨‍⚕️</div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#1e293b' }}>{r.fullName}</div>
                          <div style={{ color: '#6366f1', fontSize: '13px' }}>{r.specialization}</div>
                        </div>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '12px' }}>📍 {r.location}</div>
                      <div style={{ color: '#6366f1', fontSize: '13px', fontWeight: '600' }}>Click to view slots →</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;