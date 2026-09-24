import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Users, UserCheck, Award, AlertCircle, Sparkles, Building2, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function PublicTeamPage() {
  const { tokenOrId } = useParams();
  const [teamInfo, setTeamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchPublicTeamInfo = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`/api/teams/public/${tokenOrId}`);
        if (isMounted && res.data?.team) {
          setTeamInfo(res.data.team);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.error || 'Team record not found or link has expired.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPublicTeamInfo();
    return () => { isMounted = false; };
  }, [tokenOrId]);

  if (loading) {
    return (
      <div className="main-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div className="glass-panel" style={{ padding: '2.5rem 3rem', textAlign: 'center', maxWidth: '420px' }}>
          <div className="pulse-cyan" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '3px solid #00F2FE', borderTopColor: 'transparent', margin: '0 auto 1.25rem', animation: 'spin 1s linear infinite' }} />
          <h3 style={{ color: '#F8FAFC', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>Verifying Team Credentials...</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.5rem' }}>Fetching secure event verification pass</p>
        </div>
      </div>
    );
  }

  if (error || !teamInfo) {
    return (
      <div className="main-layout" style={{ maxWidth: '540px', margin: '3rem auto' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', borderColor: '#FF4B4B', boxShadow: '0 0 35px rgba(255, 75, 75, 0.2)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 75, 75, 0.15)', border: '2px solid #FF4B4B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <AlertCircle size={34} color="#FF4B4B" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#FF4B4B', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            INVALID OR UNKNOWN TEAM QR
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
            {error || 'This QR Code does not match any registered team in Event ALPHA database.'}
          </p>
          <Link to="/" className="btn-alpha-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}>
            <ArrowLeft size={16} /> Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-layout" style={{ maxWidth: '780px', margin: '1.5rem auto', padding: '0 1rem' }}>
      
      {/* VERIFICATION BADGE HEADER */}
      <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center', marginBottom: '1.5rem', borderColor: '#00E676', boxShadow: '0 0 35px rgba(0, 230, 118, 0.2)' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(0, 230, 118, 0.15)', border: '2px solid #00E676', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 0 20px rgba(0,230,118,0.3)' }}>
          <ShieldCheck size={38} color="#00E676" />
        </div>
        
        <div style={{ fontSize: '0.78rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#00E676', fontWeight: '800', marginBottom: '0.35rem' }}>
          OFFICIAL HACKATHON VERIFIED TEAM PASS
        </div>
        
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#F8FAFC', fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          {teamInfo.teamName}
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <span style={{ fontFamily: 'Orbitron, monospace', background: 'rgba(0, 242, 254, 0.15)', color: '#00F2FE', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '800' }}>
            Team ID: {teamInfo.teamId}
          </span>
          <span style={{ background: 'rgba(0, 230, 118, 0.15)', color: '#00E676', border: '1px solid rgba(0, 230, 118, 0.3)', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={14} /> Status: {teamInfo.registrationStatus}
          </span>
        </div>
      </div>

      {/* TEAM INFORMATION CARD */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #00F2FE' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#00F2FE', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={18} /> INSTITUTION & ACADEMIC DETAILS
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>College / University</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#F8FAFC', marginTop: '0.15rem' }}>{teamInfo.college}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Department</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#F8FAFC', marginTop: '0.15rem' }}>{teamInfo.department}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Event Pass Status</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#00E676', marginTop: '0.15rem' }}>{teamInfo.eventPassStatus}</div>
          </div>
        </div>
      </div>

      {/* SELECTED PROBLEM STATEMENT (IF ANY) */}
      {teamInfo.selectionConfirmed && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #FFD700' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: '#FFD700', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#FFD700" /> SELECTED PROBLEM STATEMENT
          </h3>
          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.2rem', fontWeight: '800', color: '#FFD700' }}>
            {teamInfo.selectedProblemCode}
          </div>
          {teamInfo.selectedProblemTitle && (
            <div style={{ fontSize: '0.95rem', color: '#F8FAFC', marginTop: '0.35rem', fontWeight: '600' }}>
              {teamInfo.selectedProblemTitle}
            </div>
          )}
        </div>
      )}

      {/* TEAM LEAD SECTION */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #00E676' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#00E676', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCheck size={18} /> TEAM LEAD
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'rgba(0, 230, 118, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(0, 230, 118, 0.2)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Lead Name</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#F8FAFC' }}>{teamInfo.teamLead?.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Registration Number</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#00F2FE', fontFamily: 'Orbitron, monospace' }}>{teamInfo.teamLead?.registrationNumber}</div>
          </div>
        </div>
      </div>

      {/* TEAM MEMBERS SECTION (ALL MEMBERS) */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#F8FAFC', fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={18} color="#00F2FE" /> ALL REGISTERED TEAM MEMBERS ({teamInfo.members?.length || 0})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {teamInfo.members?.map((mem, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.25rem',
              background: mem.role === 'LEAD' ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: `1px solid ${mem.role === 'LEAD' ? 'rgba(0, 230, 118, 0.25)' : 'rgba(255, 255, 255, 0.08)'}`,
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0, 242, 254, 0.15)', color: '#00F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }}>
                  {idx + 1}
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#F8FAFC' }}>
                    {mem.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    Role: <span style={{ color: mem.role === 'LEAD' ? '#00E676' : '#00F2FE', fontWeight: '700' }}>{mem.role || 'MEMBER'}</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Registration Number</div>
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1rem', fontWeight: '800', color: '#00F2FE' }}>
                  {mem.registrationNumber}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER VERIFICATION NOTE */}
      <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem', paddingBottom: '2rem' }}>
        Event ALPHA 2026 • Verified Public QR Pass • KARE IEEE Education Society
      </div>
    </div>
  );
}
