import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface BusRoute {
  id: number;
  fromCity: string;
  toCity: string;
  departure: string;
  arrival: string;
  price: number;
  availableSeats: number;
}

interface Booking {
  id: number;
  passengerName: string;
  route: string;
  seatNumber: string;
  price: number;
}

const API_BASE = 'http://localhost:8080/api';

function App() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [passengerName, setPassengerName] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [activeTab, setActiveTab] = useState<'routes' | 'bookings'>('routes');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRoutes();
    fetchBookings();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/routes`);
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE}/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoute || !passengerName || !seatNumber) {
      setMessage('Please fill all fields');
      return;
    }

    try {
      await axios.post(`${API_BASE}/book`, {
        routeId: selectedRoute.id,
        passengerName,
        seatNumber
      });
      
      setMessage('Booking successful!');
      setPassengerName('');
      setSeatNumber('');
      setSelectedRoute(null);
      fetchRoutes();
      fetchBookings();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚌 Bus Ticket Booker</h1>
        <p>Book your journey with ease</p>
      </header>

      <div className="tabs">
        <button 
          className={activeTab === 'routes' ? 'active' : ''} 
          onClick={() => setActiveTab('routes')}
        >
          Available Routes
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''} 
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings
        </button>
      </div>

      {activeTab === 'routes' && (
        <div className="routes-container">
          <h2>Available Bus Routes</h2>
          <div className="routes-grid">
            {routes.map(route => (
              <div key={route.id} className="route-card">
                <h3>{route.fromCity} → {route.toCity}</h3>
                <p><strong>Departure:</strong> {route.departure}</p>
                <p><strong>Arrival:</strong> {route.arrival}</p>
                <p><strong>Price:</strong> ₹{route.price}</p>
                <p><strong>Seats Left:</strong> {route.availableSeats}</p>
                
                <button 
                  onClick={() => setSelectedRoute(route)}
                  disabled={route.availableSeats <= 0}
                >
                  Book Ticket
                </button>
              </div>
            ))}
          </div>

          {selectedRoute && (
            <div className="booking-modal">
              <h3>Book Ticket for {selectedRoute.fromCity} → {selectedRoute.toCity}</h3>
              <form onSubmit={handleBook}>
                <input
                  type="text"
                  placeholder="Passenger Name"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Seat Number (e.g. A12)"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                  required
                />
                <button type="submit">Confirm Booking</button>
                <button type="button" onClick={() => setSelectedRoute(null)}>Cancel</button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bookings-container">
          <h2>My Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <h3>{booking.route}</h3>
                  <p><strong>Passenger:</strong> {booking.passengerName}</p>
                  <p><strong>Seat:</strong> {booking.seatNumber}</p>
                  <p><strong>Price:</strong> ₹{booking.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;