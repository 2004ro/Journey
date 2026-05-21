import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JourneyDetails = () => {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({ type: 'BUS', sourceId: '', destinationId: '', date: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8081/api/cities').then(res => setCities(res.data)).catch(() => {
      // fallback sample
      setCities([{id:1,name:'New Delhi'},{id:2,name:'Mumbai'}]);
    });
    const today = new Date().toISOString().split('T')[0];
    setForm(f => ({...f, date: today}));
  }, []);

  const saveAndNext = async (e) => {
    e.preventDefault();
    // save draft
    localStorage.setItem('bookingDraft', JSON.stringify(form));
    // compute price (optional)
    try {
      const res = await axios.post('http://localhost:8081/api/cities/price', { sourceId: form.sourceId, destinationId: form.destinationId, type: form.type });
      localStorage.setItem('bookingPrice', JSON.stringify(res.data));
    } catch (err) {
      // ignore
    }
    navigate('/book/seats');
  };

  return (
    <div>
      <h2>1. Journey Details</h2>
      <form onSubmit={saveAndNext} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr', marginTop: '1rem' }}>
        <div>
          <label>Transport Type</label>
          <select className="form-control" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option value="BUS">Bus</option>
            <option value="TRAIN">Train</option>
            <option value="FLIGHT">Flight</option>
          </select>
        </div>
        <div>
          <label>Date of Journey</label>
          <input type="date" className="form-control" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
        </div>
        <div>
          <label>Source City</label>
          <select className="form-control" value={form.sourceId} onChange={e => setForm({...form, sourceId: e.target.value})} required>
            <option value="">-- Select source --</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name} {c.state ? `, ${c.state}` : ''}</option>)}
          </select>
        </div>
        <div>
          <label>Destination City</label>
          <select className="form-control" value={form.destinationId} onChange={e => setForm({...form, destinationId: e.target.value})} required>
            <option value="">-- Select destination --</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name} {c.state ? `, ${c.state}` : ''}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button type="button" className="btn-control" onClick={() => navigate('/dashboard')}>Cancel</button>
          <button type="submit" className="btn-primary">Next: Select Seat</button>
        </div>
      </form>
    </div>
  );
}

export default JourneyDetails;
