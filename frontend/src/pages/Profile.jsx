import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const email = (localStorage.getItem('userEmail') || 'guest@example.com').toLowerCase();
  const name = localStorage.getItem('userName') || email.split('@')[0];
  const role = email === 'admin@admin.com' ? 'System Administrator' : 'Traveller';
  
  // State for user details
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  
  // State for travel preferences
  const [prefTransport, setPrefTransport] = useState('');
  const [prefSeat, setPrefSeat] = useState('');
  const [prefMeal, setPrefMeal] = useState('');
  const [travelClass, setTravelClass] = useState('');

  // Stats from bookings
  const [totalBookings, setTotalBookings] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [createdDate, setCreatedDate] = useState('');

  const fetchProfileAndStats = async () => {
    // 1. Fetch Profile Data from Backend
    try {
      const res = await axios.get(`http://localhost:8081/api/auth/profile/${email}`);
      const u = res.data;
      if (u) {
        setPhone(u.phone || '');
        setDob(u.dob || '');
        setGender(u.gender || '');
        setAddress(u.address || '');
        setPrefTransport(u.prefTransport || '');
        setPrefSeat(u.prefSeat || '');
        setPrefMeal(u.prefMeal || '');
        setTravelClass(u.travelClass || '');
        if (u.createdDate) {
          const d = new Date(u.createdDate);
          const formatted = d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) + 
                            ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          setCreatedDate(formatted);
        } else {
          setCreatedDate('');
        }
      }
    } catch (err) {
      console.warn("User profile not found in backend, will be initialized on save.");
    }

    // 2. Fetch Bookings Stats
    try {
      const res = await axios.get(`http://localhost:8081/api/bookings/user/${email}`);
      const backendBookings = res.data || [];
      
      const localBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]').filter(b => b.userEmail === email);
      const combined = [...backendBookings];
      localBookings.forEach(local => {
        const exists = backendBookings.some(b => 
          b.date === local.date && 
          b.source === local.source && 
          b.destination === local.destination &&
          b.passengerName === local.passengerName
        );
        if (!exists) {
          combined.push(local);
        }
      });

      setTotalBookings(combined.length);
      setActiveBookings(combined.filter(b => b.status === 'BOOKED').length);
    } catch (err) {
      const localBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]').filter(b => b.userEmail === email);
      setTotalBookings(localBookings.length);
      setActiveBookings(localBookings.filter(b => b.status === 'BOOKED').length);
    }
  };

  useEffect(() => {
    fetchProfileAndStats();
  }, [email]);

  const handleSave = async (e) => {
    e.preventDefault();
    const profileData = {
      email,
      phone,
      dob,
      gender,
      address,
      prefTransport,
      prefSeat,
      prefMeal,
      travelClass
    };

    try {
      await axios.post('http://localhost:8081/api/auth/profile/update', profileData);
      setSaveSuccess('🎉 Profile permanently saved in database!');
      setIsEditing(false);
      fetchProfileAndStats();
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      setSaveSuccess('❌ Error saving profile to backend.');
      setTimeout(() => setSaveSuccess(''), 3000);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {saveSuccess && <div className="toast" style={{ top: '20px' }}>{saveSuccess}</div>}

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ 
              width: '90px', height: '90px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary), #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', color: 'white', fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
            }}>
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.6rem', letterSpacing: '0.5px' }}>{name.toUpperCase()}</h3>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>{email}</p>
              <span className="badge booked" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>{role}</span>
            </div>
          </div>
          
          {/* Loyalty Program Section */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid var(--glass-border)', 
            borderRadius: '12px', 
            padding: '1rem 1.5rem',
            textAlign: 'right',
            minWidth: '200px'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Loyalty Tier</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#F59E0B', margin: '0.2rem 0' }}>🏆 Gold Voyager</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Points: <strong style={{ color: 'var(--success)' }}>4,250 GP</strong></div>
          </div>
        </div>
      </div>

      {/* Dynamic Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.2rem', textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
          <h4 style={{ margin: '0', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Bookings</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '8px 0 0 0', color: 'var(--text-main)' }}>{totalBookings}</p>
        </div>
        <div className="glass-card" style={{ padding: '1.2rem', textAlign: 'center', borderTop: '4px solid var(--success)' }}>
          <h4 style={{ margin: '0', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Active Journeys</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '8px 0 0 0', color: 'var(--success)' }}>{activeBookings}</p>
        </div>
        <div className="glass-card" style={{ padding: '1.2rem', textAlign: 'center', borderTop: '4px solid #F59E0B' }}>
          <h4 style={{ margin: '0', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Preferred Mode</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '12px 0 0 0', color: '#F59E0B' }}>
            {prefTransport === 'FLIGHT' && '✈️ Flight'}
            {prefTransport === 'TRAIN' && '🚆 Train'}
            {prefTransport === 'BUS' && '🚌 Bus'}
            {!prefTransport && 'Not Added'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Left Column: Personal Information */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Personal Details</h3>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label>Full Name</label>
              <input type="text" className="form-control" value={name} disabled />
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label>Email Address</label>
              <input type="text" className="form-control" value={email} disabled />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Phone Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={isEditing ? phone : (phone || 'Complete Your Profile')} 
                onChange={(e) => setPhone(e.target.value)} 
                disabled={!isEditing} 
                style={{ color: (!isEditing && !phone) ? 'var(--text-muted)' : 'var(--text-main)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0, flex: 1 }}>
                <label>Date of Birth</label>
                {isEditing ? (
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dob} 
                    onChange={(e) => setDob(e.target.value)} 
                  />
                ) : (
                  <input 
                    type="text" 
                    className="form-control" 
                    value={dob || 'Not Added'} 
                    disabled 
                    style={{ color: !dob ? 'var(--text-muted)' : 'var(--text-main)' }}
                  />
                )}
              </div>

              <div className="form-group" style={{ margin: 0, flex: 1 }}>
                <label>Gender</label>
                {isEditing ? (
                  <select 
                    className="form-control" 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <input 
                    type="text" 
                    className="form-control" 
                    value={gender || 'Not Added'} 
                    disabled 
                    style={{ color: !gender ? 'var(--text-muted)' : 'var(--text-main)' }}
                  />
                )}
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Saved Address</label>
              <input 
                type="text" 
                className="form-control" 
                value={isEditing ? address : (address || 'Complete Your Profile')} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Enter your saved address"
                disabled={!isEditing} 
                style={{ color: (!isEditing && !address) ? 'var(--text-muted)' : 'var(--text-main)' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Account Created Date</label>
              <input 
                type="text" 
                className="form-control" 
                value={createdDate || 'Not Available'} 
                disabled 
              />
            </div>
          </div>

          {/* Right Column: Travel Preferences */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Travel Preferences</h3>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label>Preferred Mode of Transport</label>
              {isEditing ? (
                <select 
                  className="form-control" 
                  value={prefTransport} 
                  onChange={(e) => setPrefTransport(e.target.value)}
                >
                  <option value="">Select Transport</option>
                  <option value="FLIGHT">Flight (✈️)</option>
                  <option value="TRAIN">Train (🚆)</option>
                  <option value="BUS">Bus (🚌)</option>
                </select>
              ) : (
                <input 
                  type="text" 
                  className="form-control" 
                  value={
                    prefTransport === 'FLIGHT' ? '✈️ Flight' :
                    prefTransport === 'TRAIN' ? '🚆 Train' :
                    prefTransport === 'BUS' ? '🚌 Bus' : 'Not Added'
                  } 
                  disabled 
                  style={{ color: !prefTransport ? 'var(--text-muted)' : 'var(--text-main)' }}
                />
              )}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Preferred Seat Choice</label>
              {isEditing ? (
                <select 
                  className="form-control" 
                  value={prefSeat} 
                  onChange={(e) => setPrefSeat(e.target.value)}
                >
                  <option value="">Select Seat</option>
                  <option value="Window">Window Seat</option>
                  <option value="Aisle">Aisle Seat</option>
                  <option value="No Preference">No Preference</option>
                </select>
              ) : (
                <input 
                  type="text" 
                  className="form-control" 
                  value={prefSeat || 'Not Added'} 
                  disabled 
                  style={{ color: !prefSeat ? 'var(--text-muted)' : 'var(--text-main)' }}
                />
              )}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>In-Journey Meal Preference</label>
              {isEditing ? (
                <select 
                  className="form-control" 
                  value={prefMeal} 
                  onChange={(e) => setPrefMeal(e.target.value)}
                >
                  <option value="">Select Meal</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="No Meal">No Meal</option>
                </select>
              ) : (
                <input 
                  type="text" 
                  className="form-control" 
                  value={prefMeal || 'Not Added'} 
                  disabled 
                  style={{ color: !prefMeal ? 'var(--text-muted)' : 'var(--text-main)' }}
                />
              )}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Preferred Travel Class</label>
              {isEditing ? (
                <select 
                  className="form-control" 
                  value={travelClass} 
                  onChange={(e) => setTravelClass(e.target.value)}
                >
                  <option value="">Select Travel Class</option>
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business</option>
                  <option value="First Class">First Class</option>
                </select>
              ) : (
                <input 
                  type="text" 
                  className="form-control" 
                  value={travelClass || 'Not Added'} 
                  disabled 
                  style={{ color: !travelClass ? 'var(--text-muted)' : 'var(--text-main)' }}
                />
              )}
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem' }}>
              {!isEditing ? (
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={() => setIsEditing(true)}
                  style={{ width: 'auto', padding: '0.6rem 1.5rem' }}
                >
                  📝 Edit Profile
                </button>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="btn-control" 
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfileAndStats(); // Reset changes
                    }}
                    style={{ width: 'auto', padding: '0.6rem 1.5rem' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    style={{ width: 'auto', padding: '0.6rem 1.5rem', backgroundColor: 'var(--success)' }}
                  >
                    💾 Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default Profile;
