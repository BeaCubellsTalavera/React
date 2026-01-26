import { Routes, Route } from 'react-router'
import { useState, useEffect } from 'react';
import axios from 'axios';
import HomePage from './pages/Home/HomePage'
import CheckoutPage from './pages/Checkout/CheckoutPage';
import OrdersPage from './pages/Orders/OrdersPage';
import TrackingPage from './pages/TrackingPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css'

function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const getAppData = async () => {
      const response = await axios.get('/api/cart-items?expand=product');
      setCart(response.data);
    };

    getAppData();
  }, []);

  return (
    <Routes>
      <Route index element={<HomePage cart={cart} />} /> {/* path="/" is the same as index */}
      <Route path="checkout" element={<CheckoutPage cart={cart}/>} />
      <Route path="orders" element={<OrdersPage cart={cart}/>} />
      <Route path="tracking" element={<TrackingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;
