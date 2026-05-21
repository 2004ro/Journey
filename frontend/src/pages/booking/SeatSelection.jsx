import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SeatSelection = () => {
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [draft, setDraft] = useState({});

  useEffect(() => {
    const d = JSON.parse(localStorage.getItem('bookingDraft') || '{}');
    setDraft(d);
    // create deterministic seat layout for demo
    const arr = Array.from({ length: 24 }, (_, i) => ({ id: `S${i+1}`, isOccupied: Math.random() > 0.8 }));
    setSeats(arr);
  }, []);

  const selectSeat = (s) => {
    if (s.isOccupied) return;
    setDraft({...draft, seat: s.id});
  };

  const next = () => {
    if (!draft.seat) { alert('Please select a seat'); return; }
    localStorage.setItem('bookingDraft', JSON.stringify(draft));
    navigate('/book/passenger');
  };

  return (
    <div>
      <h2>2. Interactive Seat Selection</h2>
      <p style={{ color: 'var(--text-muted)' }}>Click a seat to select. Grey seats are occupied.</p>
      <div className="seat-grid" style={{ marginTop: '1rem' }}>
        {seats.map(s => (
          <div key={s.id} className={`seat ${s.isOccupied ? 'occupied' : ''} ${draft.seat === s.id ? 'selected' : ''}`} onClick={() => selectSeat(s)}>
            {s.id}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <button className="btn-control" onClick={() => window.history.back()}>Back</button>
        <button className="btn-primary" onClick={next}>Next: Passenger Details</button>
      </div>
    </div>
  );
}

export default SeatSelection;
