import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, cancelled: 0, revenue: 0 });

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/bookings/all');
      const data = res.data;
      setBookings(data);
      calculateStats(data);
    } catch (err) {
      console.log("Using mock data for Admin");
      const mock = [
        { id: 1, type: 'FLIGHT', source: 'New York', destination: 'London', date: '2026-06-01', status: 'BOOKED', price: 450.00, userEmail: 'user1@test.com', passengerName: 'John Doe', passengerAge: 30 },
        { id: 2, type: 'TRAIN', source: 'Paris', destination: 'Berlin', date: '2026-06-15', status: 'CANCELLED', price: 120.00, userEmail: 'user2@test.com', passengerName: 'Jane Smith', passengerAge: 25 },
        { id: 3, type: 'BUS', source: 'Delhi', destination: 'Mumbai', date: '2026-07-10', status: 'BOOKED', price: 50.00, userEmail: 'user3@test.com', passengerName: 'Raj Kumar', passengerAge: 40 }
      ];
      setBookings(mock);
      calculateStats(mock);
    }
  };

  const calculateStats = (data) => {
    let active = 0;
    let cancelled = 0;
    let revenue = 0;
    
    data.forEach(b => {
      if (b.status === 'BOOKED') {
        active++;
        revenue += b.price || 0;
      } else if (b.status === 'CANCELLED') {
        cancelled++;
      }
    });

    setStats({
      total: data.length,
      active,
      cancelled,
      revenue
    });
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleCancel = async (id) => {
    if(!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await axios.put(`http://localhost:8080/api/bookings/cancel/${id}`);
      fetchAllBookings();
    } catch (err) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
      calculateStats(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1100px' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Admin Dashboard</h2>
      
      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '4px solid #4F46E5' }}>
          <h3 style={{ margin: '0', color: 'var(--text-muted)' }}>Total Bookings</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0 0 0' }}>{stats.total}</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '4px solid #10B981' }}>
          <h3 style={{ margin: '0', color: 'var(--text-muted)' }}>Active Tickets</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0 0 0', color: 'var(--success)' }}>{stats.active}</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '4px solid #EF4444' }}>
          <h3 style={{ margin: '0', color: 'var(--text-muted)' }}>Cancelled</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0 0 0', color: 'var(--danger)' }}>{stats.cancelled}</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '4px solid #F59E0B' }}>
          <h3 style={{ margin: '0', color: 'var(--text-muted)' }}>Total Revenue</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0 0 0', color: '#F59E0B' }}>${stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="glass-card">
        <h3>All System Bookings</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User / Passenger</th>
                <th>Route Details</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>
                    <div><strong>{b.passengerName || 'N/A'}</strong> ({b.passengerAge || 'N/A'})</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                  </td>
                  <td>
                    <div>{b.type} | {b.date}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.source} &rarr; {b.destination}</div>
                  </td>
                  <td>${b.price?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === 'BOOKED' && (
                      <button className="btn-danger" onClick={() => handleCancel(b.id)}>Force Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
