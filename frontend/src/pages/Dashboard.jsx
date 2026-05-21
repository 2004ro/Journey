import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [bookings, setBookings] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [toast, setToast] = useState('');
  const email = localStorage.getItem('userEmail');

  const todayDate = new Date().toISOString().split('T')[0];

  const [searchForm, setSearchForm] = useState({
    type: 'BUS',
    source: '',
    destination: '',
    date: todayDate,
    passengerName: '',
    passengerAge: '',
    seat: ''
  });

  const [pendingBooking, setPendingBooking] = useState(null);

  // Mock seats array
  const seats = Array.from({ length: 16 }, (_, i) => ({
    id: `S${i+1}`,
    isOccupied: Math.random() > 0.7 // randomly occupy some seats
  }));

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/bookings/user/${email}`);
      setBookings(res.data);
    } catch (err) {
      if(bookings.length === 0) {
        setBookings([{ id: 1, type: 'FLIGHT', source: 'New York', destination: 'London', date: '2026-06-01', status: 'BOOKED', price: 450.00, passengerName: 'John Doe', passengerAge: 22 }]);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchBookings();
    }
  }, [activeTab]);

  const handleBookInitiate = (e) => {
    e.preventDefault();
    if (!searchForm.seat) {
      alert("Please select a seat!");
      return;
    }
    const newBooking = {
      ...searchForm,
      userEmail: email,
      price: Math.floor(Math.random() * 500) + 50
    };
    setPendingBooking(newBooking);
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    setPaymentProcessing(true);
    setTimeout(async () => {
      try {
        await axios.post('http://localhost:8081/api/bookings/book', pendingBooking);
        setPaymentProcessing(false);
        setShowPaymentModal(false);
        showToast('🎉 Ticket Booked Successfully!');
        setActiveTab('history');
      } catch (err) {
        setPaymentProcessing(false);
        setShowPaymentModal(false);
        setBookings([...bookings, { ...pendingBooking, id: Date.now(), status: 'BOOKED' }]);
        showToast('🎉 Mock Booking Successful!');
        setActiveTab('history');
      }
    }, 2000); 
  };

  const handleCancel = async (id) => {
    const ok = window.confirm('Are you sure you want to cancel this booking?');
    if (!ok) return;
    try {
      await axios.put(`http://localhost:8081/api/bookings/cancel/${id}`);
      fetchBookings();
      showToast('❌ Ticket Cancelled');
    } catch (err) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
      showToast('❌ Ticket Cancelled (Mock)');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1000px' }}>
      
      {toast && <div className="toast">{toast}</div>}

      {showPaymentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <div className="glass-card" style={{ width: '400px', textAlign: 'center' }}>
            <h3>Secure Payment Gateway</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Amount to pay: <strong style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>${pendingBooking?.price}</strong>
            </p>
            {paymentProcessing ? (
              <div style={{ margin: '2rem 0' }}>
                <div style={{ border: '4px solid rgba(100,100,100,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-main)' }}>Processing your payment securely...</p>
              </div>
            ) : (
              <div>
                <input type="text" className="form-control" placeholder="Card Number" style={{ marginBottom: '1rem', width: '100%', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                  <input type="text" className="form-control" placeholder="MM/YY" style={{ width: '50%' }} />
                  <input type="text" className="form-control" placeholder="CVC" style={{ width: '50%' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn-danger" style={{ flex: 1 }} onClick={() => setShowPaymentModal(false)}>Cancel</button>
                  <button className="btn-primary" style={{ flex: 1, backgroundColor: 'var(--success)' }} onClick={confirmPayment}>Pay Now</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={activeTab === 'search' ? 'btn-primary' : 'btn-control'}
          onClick={() => setActiveTab('search')}
          style={{ width: 'auto', background: activeTab !== 'search' ? 'transparent' : '', border: activeTab !== 'search' ? '1px solid var(--glass-border)' : '', color: activeTab !== 'search' ? 'var(--text-main)' : '' }}
        >
          🔍 Search & Book
        </button>
        <button 
          className={activeTab === 'history' ? 'btn-primary' : 'btn-control'}
          onClick={() => setActiveTab('history')}
          style={{ width: 'auto', background: activeTab !== 'history' ? 'transparent' : '', border: activeTab !== 'history' ? '1px solid var(--glass-border)' : '', color: activeTab !== 'history' ? 'var(--text-main)' : '' }}
        >
          📜 Booking History
        </button>
      </div>

      <div className="glass-card">
        {activeTab === 'search' ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2>Start a New Booking</h2>
            <p style={{ color: 'var(--text-muted)' }}>The booking flow is split across three pages: Journey Details → Seat Selection → Passenger Details</p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a href="/book/details" className="btn-primary" style={{ padding: '0.8rem 1.2rem' }}>🚀 Start Booking</a>
              <a href="/book/details" className="btn-control" style={{ padding: '0.8rem 1.2rem' }}>How it works</a>
            </div>
          </div>
        ) : (
          <div>
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
                      <td>{booking.source} &rarr; {booking.destination}</td>
                      <td>
                        {booking.passengerName || 'N/A'} <br/>
                        <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Age: {booking.passengerAge || 'N/A'}</span>
                      </td>
                      <td>{booking.date}</td>
                      <td>${booking.price?.toFixed(2)}</td>
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
