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

  const loadCart = async () => {
    const response = await axios.get('/api/cart-items?expand=product');
    setCart(response.data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <Routes>
      <Route index element={<HomePage cart={cart} loadCart={loadCart} />} /> {/* path="/" is the same as index */}
      <Route path="checkout" element={<CheckoutPage cart={cart} loadCart={loadCart} />} />
      <Route path="orders" element={<OrdersPage cart={cart} loadCart={loadCart} />} />
      <Route path="tracking/:orderId/:productId" element={<TrackingPage cart={cart}/>} />
      <Route path="*" element={<NotFoundPage cart={cart}/>} />
    </Routes>
  )
}

export default App;
