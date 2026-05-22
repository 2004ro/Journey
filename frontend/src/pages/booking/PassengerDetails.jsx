import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PassengerDetails = () => {
  const navigate = useNavigate();
  const [draft, setDraft] = useState({});
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [priceInfo, setPriceInfo] = useState(null);

  useEffect(() => {
    const d = JSON.parse(localStorage.getItem('bookingDraft') || '{}');
    setDraft(d);
    setEmail(localStorage.getItem('userEmail') || '');
    const p = JSON.parse(localStorage.getItem('bookingPrice') || 'null');
    if (p) setPriceInfo(p);
  }, []);

  const submitBooking = async (e) => {
    e.preventDefault();
    const booking = {
      type: draft.type,
      source: draft.sourceId ? draft.sourceId : draft.source,
      destination: draft.destinationId ? draft.destinationId : draft.destination,
      sourceName: draft.sourceName || '',
      destinationName: draft.destinationName || '',
      date: draft.date,
      seat: draft.seat,
      passengerName: name,
      passengerAge: parseInt(age),
      userEmail: email ? email.toLowerCase() : email,
      price: priceInfo ? priceInfo.price : 0
    };

    const localBooking = {
      ...booking,
      id: Date.now(),
      status: 'BOOKED'
    };

    try {
      await axios.post('http://localhost:8081/api/bookings/book', booking);
      
      // Save locally as a backup
      const localBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
      localBookings.push(localBooking);
      localStorage.setItem('mockBookings', JSON.stringify(localBookings));

      alert('🎉 Booking successful!');
      localStorage.removeItem('bookingDraft');
      localStorage.removeItem('bookingPrice');
      navigate('/dashboard');
    } catch (err) {
      // Fallback local persistence
      const localBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
      localBookings.push(localBooking);
      localStorage.setItem('mockBookings', JSON.stringify(localBookings));

      alert('🎉 Booking (mock) successful!');
      localStorage.removeItem('bookingDraft');
      localStorage.removeItem('bookingPrice');
      navigate('/dashboard');
    }
  };

  return (
    <div>
      <h2>3. Passenger Details</h2>
      <form onSubmit={submitBooking} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr', marginTop: '1rem' }}>
        <div>
          <label>Full Name</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Age</label>
          <input className="form-control" type="number" min="1" max="120" value={age} onChange={e => setAge(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Price</label>
          <div style={{ padding: '0.6rem', border: '1px solid var(--glass-border)', borderRadius: '6px' }}>{priceInfo ? `${priceInfo.price} ${priceInfo.currency}` : 'Calculated at previous step'}</div>
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button type="button" className="btn-control" onClick={() => window.history.back()}>Back</button>
          <button type="submit" className="btn-primary">Confirm & Book</button>
        </div>
      </form>
    </div>
  );
}

export default PassengerDetails;
