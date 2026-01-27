import { Routes, Route } from 'react-router'
import { useState, useEffect } from 'react';
import axios from 'axios';
import HomePage from './pages/Home/HomePage'
import CheckoutPage from './pages/Checkout/CheckoutPage';
import OrdersPage from './pages/Orders/OrdersPage';
import TrackingPage from './pages/TrackingPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';
import type { CartItem } from './types';
import './App.css'

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const shouldShowHeader = (): boolean => {
    const routesWithoutHeader = ['/checkout'];
    return !routesWithoutHeader.some(route => 
      location.pathname === route || location.pathname.startsWith(route + '/')
    );
  };

  const loadCart = async (): Promise<void> => {
    const response = await axios.get<CartItem[]>('/api/cart-items?expand=product');
    setCart(response.data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <>
      {shouldShowHeader() && <Header cart={cart} />}
      <Routes>
        <Route index element={<HomePage cart={cart} loadCart={loadCart} />} /> {/* path="/" is the same as index */}
        <Route path="checkout" element={<CheckoutPage cart={cart} loadCart={loadCart} />} />
        <Route path="orders" element={<OrdersPage cart={cart} loadCart={loadCart} />} />
        <Route path="tracking/:orderId/:productId" element={<TrackingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App;
