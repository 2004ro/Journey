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
      const res = await axios.get(`http://localhost:8080/api/bookings/user/${email}`);
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
        await axios.post('http://localhost:8080/api/bookings/book', pendingBooking);
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
    try {
      await axios.put(`http://localhost:8080/api/bookings/cancel/${id}`);
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
          <div>
            <h2>Find Your Perfect Journey</h2>
            <form onSubmit={handleBookInitiate} style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)' }}>1. Journey Details</h4>
              </div>
              <div className="form-group">
                <label>Transport Type</label>
                <select className="form-control" value={searchForm.type} onChange={(e) => setSearchForm({...searchForm, type: e.target.value})}>
                  <option value="BUS">Bus</option>
                  <option value="TRAIN">Train</option>
                  <option value="FLIGHT">Flight</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Journey</label>
                <input type="date" className="form-control" required min={todayDate} value={searchForm.date} onChange={(e) => setSearchForm({...searchForm, date: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Source City</label>
                <input type="text" className="form-control" placeholder="e.g. New York" required value={searchForm.source} onChange={(e) => setSearchForm({...searchForm, source: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Destination City</label>
                <input type="text" className="form-control" placeholder="e.g. London" required value={searchForm.destination} onChange={(e) => setSearchForm({...searchForm, destination: e.target.value})} />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)' }}>2. Interactive Seat Selection</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Select your preferred seat. Grey seats are already booked.</p>
                <div className="seat-grid">
                  {seats.map(s => (
                    <div 
                      key={s.id} 
                      className={`seat ${s.isOccupied ? 'occupied' : ''} ${searchForm.seat === s.id ? 'selected' : ''}`}
                      onClick={() => !s.isOccupied && setSearchForm({...searchForm, seat: s.id})}
                    >
                      {s.id}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  Selected Seat: <strong>{searchForm.seat || 'None'}</strong>
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)' }}>3. Passenger Details</h4>
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" placeholder="Passenger Name" required value={searchForm.passengerName} onChange={(e) => setSearchForm({...searchForm, passengerName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" className="form-control" placeholder="Age" required min="1" max="120" value={searchForm.passengerAge} onChange={(e) => setSearchForm({...searchForm, passengerAge: e.target.value})} />
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Proceed to Payment</button>
              </div>
            </form>
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
