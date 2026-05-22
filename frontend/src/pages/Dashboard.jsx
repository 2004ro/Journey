import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState('');
  const email = (localStorage.getItem('userEmail') || '').toLowerCase();

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchBookings = async () => {
    try {
      const [res, citiesRes] = await Promise.all([
        axios.get(`http://localhost:8081/api/bookings/user/${email}`),
        axios.get('http://localhost:8081/api/cities')
      ]);
      const cityMap = {};
      (citiesRes.data || []).forEach(c => { cityMap[String(c.id)] = c.name; });
      
      const backendData = (res.data || []).map(b => ({
        ...b,
        price: b.price,
        currency: 'INR',
        sourceName: b.sourceName || cityMap[String(b.source)] || b.source,
        destinationName: b.destinationName || cityMap[String(b.destination)] || b.destination
      }));

      // Combine backend data with localStorage data to avoid losing locally saved bookings
      const localBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]').filter(b => b.userEmail === email);
      
      // Merge by using backend bookings, and appending any local bookings that aren't represented in the backend
      const combined = [...backendData];
      localBookings.forEach(local => {
        const exists = backendData.some(b => 
          b.date === local.date && 
          b.source === local.source && 
          b.destination === local.destination &&
          b.passengerName === local.passengerName
        );
        if (!exists) {
          combined.push(local);
        }
      });

      setBookings(combined);
    } catch (err) {
      // Fallback: Read mock bookings from localStorage filtered by email
      const localBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]').filter(b => b.userEmail === email);
      setBookings(localBookings);
    }
  };

  useEffect(() => {
    if (email) {
      fetchBookings();
    }
  }, [email]);

  const handleCancel = async (id) => {
    const ok = window.confirm('Are you sure you want to cancel this booking?');
    if (!ok) return;
    try {
      await axios.put(`http://localhost:8081/api/bookings/cancel/${id}`);
      // Also update in localStorage if present
      const localBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
      const updated = localBookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b);
      localStorage.setItem('mockBookings', JSON.stringify(updated));
      fetchBookings();
      showToast('❌ Ticket Cancelled');
    } catch (err) {
      const localBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
      const updated = localBookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b);
      localStorage.setItem('mockBookings', JSON.stringify(updated));
      setBookings(updated.filter(b => b.userEmail === email));
      showToast('❌ Ticket Cancelled (Mock)');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1000px' }}>
      {toast && <div className="toast">{toast}</div>}

      <div className="glass-card">
        <h2>Your Bookings</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Route</th>
                <th>Passenger</th>
                <th>Date</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td>
                    {booking.type === 'FLIGHT' && '✈️ '}
                    {booking.type === 'TRAIN' && '🚆 '}
                    {booking.type === 'BUS' && '🚌 '}
                    {booking.type}
                  </td>
                  <td>{booking.sourceName || booking.source} &rarr; {booking.destinationName || booking.destination}</td>
                  <td>
                    {booking.passengerName || 'N/A'} <br/>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Age: {booking.passengerAge || 'N/A'}</span>
                  </td>
                  <td>{booking.date}</td>
                  <td>₹{(booking.price || 0).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'BOOKED' && (
                      <button className="btn-danger" onClick={() => handleCancel(booking.id)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
