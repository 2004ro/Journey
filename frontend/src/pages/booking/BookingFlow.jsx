import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import JourneyDetails from './JourneyDetails';
import SeatSelection from './SeatSelection';
import PassengerDetails from './PassengerDetails';

const BookingFlow = () => {
  return (
    <div style={{ width: '100%', maxWidth: '900px' }}>
      <div className="glass-card">
        <Routes>
          <Route path="details" element={<JourneyDetails />} />
          <Route path="seats" element={<SeatSelection />} />
          <Route path="passenger" element={<PassengerDetails />} />
          <Route path="*" element={<Navigate to="details" />} />
        </Routes>
      </div>
    </div>
  );
}

export default BookingFlow;
