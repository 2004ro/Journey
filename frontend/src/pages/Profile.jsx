import React from 'react';

const Profile = () => {
  const email = localStorage.getItem('userEmail') || 'guest@example.com';
  const name = localStorage.getItem('userName') || email.split('@')[0];
  const role = email === 'admin@admin.com' ? 'System Administrator' : 'Traveller';
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>User Profile</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary), #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', color: 'white', fontWeight: 'bold'
          }}>
            {email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{name.toUpperCase()}</h3>
            <p style={{ margin: '0', color: 'var(--text-muted)' }}>{email}</p>
            <span className="badge booked" style={{ display: 'inline-block', marginTop: '0.5rem' }}>{role}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Full Name</label>
          <input type="text" className="form-control" value={name} disabled />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="text" className="form-control" value={email} disabled />
        </div>
        <div className="form-group">
          <label>Member Since</label>
          <input type="text" className="form-control" value="2023-01-01" disabled style={{ opacity: 0.9 }} />
        </div>

        <div style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
          <strong>Note:</strong> Profile is currently stored locally for demo purposes. To persist real users, implement server-side user accounts and authentication.
        </div>

      </div>
    </div>
  );
};

export default Profile;
