import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [tab, setTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const name = localStorage.getItem('name') || '';
  const displayName = name
    ? name.startsWith('Dr.')
      ? name
      : `Dr. ${name}`
    : 'Doctor';

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const providersRes = await API.get('/providers');
      const me = providersRes.data.find(p => p.fullName === name);

      if (!me) {
        setAppointments([]);
        setSlots([]);
        setLoading(false);
        return;
      }

      const [apptRes, slotsRes] = await Promise.all([
        API.get(`/doctor/appointments/${me.providerId}`),
        API.get(`/slots/${me.providerId}`)
      ]);

      setAppointments(apptRes.data || []);
      setSlots(slotsRes.data || []);
    } catch (err) {
      console.log(err);
      setAppointments([]);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await API.put(`/doctor/cancel/${appointmentId}`);
      alert('Appointment cancelled successfully!');
      loadData();
    } catch (err) {
      console.log(err);
      alert('Failed to cancel appointment');
    }
  };

  const stats = [
    {
      label: 'Total Patients',
      value: appointments.length,
      icon: '👥',
      color: '#3b82f6',
    },
    {
      label: 'Confirmed',
      value: appointments.filter(a => a.status === 'confirmed').length,
      icon: '✅',
      color: '#16a34a',
    },
    {
      label: 'Cancelled',
      value: appointments.filter(a =>
        a.status === 'cancelled' || a.status === 'cancelled_by_doctor'
      ).length,
      icon: '❌',
      color: '#dc2626',
    },
    {
      label: 'Free Slots',
      value: slots.length,
      icon: '🕐',
      color: '#7c3aed',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        background: '#f0fdf4',
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b, #059669)',
          padding: '0 32px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            👨‍⚕️
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '18px' }}>
              {displayName}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
              Doctor Portal — MediBook
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '8px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ padding: '28px 32px' }}>
        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '28px',
          }}
        >
          {stats.map(s => (
            <div
              key={s.label}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '22px',
                boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                border: '1px solid #d1fae5',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: s.color + '15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                }}
              >
                {s.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    color: s.color,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '3px' }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '4px',
            display: 'inline-flex',
            gap: '4px',
            marginBottom: '20px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
          }}
        >
          {[
            { key: 'appointments', label: '📋 Patient Appointments' },
            { key: 'slots', label: '🕐 My Time Slots' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700',
                background: tab === t.key ? '#059669' : 'transparent',
                color: tab === t.key ? 'white' : '#64748b',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px',
              background: 'white',
              borderRadius: '16px',
              color: '#94a3b8',
            }}
          >
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>⏳</div>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#475569' }}>
              Loading dashboard...
            </p>
          </div>
        ) : (
          <>
            {tab === 'appointments' &&
              (appointments.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '80px',
                    background: 'white',
                    borderRadius: '16px',
                    color: '#94a3b8',
                  }}
                >
                  <div style={{ fontSize: '60px', marginBottom: '16px' }}>📭</div>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#475569' }}>
                    No appointments yet
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {appointments.map(a => (
                    <div
                      key={a.appointmentId}
                      style={{
                        background: 'white',
                        borderRadius: '14px',
                        padding: '20px 24px',
                        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                        border: '1px solid #d1fae5',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #059669, #34d399)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            color: 'white',
                            fontWeight: '800',
                          }}
                        >
                          {(a.user?.fullName || '?').charAt(0)}
                        </div>

                        <div>
                          <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '16px' }}>
                            {a.user?.fullName}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>
                            🕐{' '}
                            {a.slot?.slotTime
                              ? new Date(a.slot.slotTime).toLocaleString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'No slot time'}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>
                            📝 {a.notes || 'No notes'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            padding: '7px 16px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '700',
                            background:
                              a.status === 'confirmed'
                                ? '#f0fdf4'
                                : '#fef2f2',
                            color:
                              a.status === 'confirmed'
                                ? '#16a34a'
                                : '#dc2626',
                          }}
                        >
                          {a.status?.toUpperCase()}
                        </span>

                        {a.status === 'confirmed' && (
                          <button
                            onClick={() => cancelAppointment(a.appointmentId)}
                            style={{
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {tab === 'slots' &&
              (slots.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '60px',
                    background: 'white',
                    borderRadius: '16px',
                    color: '#94a3b8',
                  }}
                >
                  <div style={{ fontSize: '50px', marginBottom: '12px' }}>✅</div>
                  <p style={{ fontWeight: '600', color: '#475569' }}>No free slots</p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {slots.map(s => (
                    <div
                      key={s.slotId}
                      style={{
                        background: 'white',
                        borderRadius: '14px',
                        padding: '20px',
                        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                        border: '2px solid #a7f3d0',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '28px', marginBottom: '10px' }}>🕐</div>
                      <div
                        style={{
                          fontWeight: '700',
                          color: '#1e293b',
                          fontSize: '15px',
                        }}
                      >
                        {new Date(s.slotTime).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </div>
                      <div
                        style={{
                          color: '#059669',
                          fontWeight: '800',
                          fontSize: '20px',
                          margin: '4px 0 10px',
                        }}
                      >
                        {new Date(s.slotTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <span
                        style={{
                          background: '#f0fdf4',
                          color: '#16a34a',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700',
                        }}
                      >
                        Available
                      </span>
                    </div>
                  ))}
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;