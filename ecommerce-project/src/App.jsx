import { Routes, Route } from 'react-router'
import { useState, useEffect } from 'react';
import axios from 'axios';
import HomePage from './pages/HomePage'
import CheckoutPage from './pages/Checkout/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import TrackingPage from './pages/TrackingPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css'

function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('/api/cart/items') // Axios is a cleaner way to do requests to the backend
      .then((response) => {
        setCart(response.data);
      });
  }, []); // Run it just once when the component is mounted

  return (
    <Routes>
      <Route index element={<HomePage cart={cart} />} /> {/* path="/" is the same as index */}
      <Route path="checkout" element={<CheckoutPage cart={cart}/>} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="tracking" element={<TrackingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;
