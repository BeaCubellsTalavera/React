import { Routes, Route } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import TrackingPage from './pages/TrackingPage.jsx';
import './App.css'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} /> {/* path="/" is the same as index */}
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="tracking" element={<TrackingPage />} />
    </Routes>
  )
}

export default App;
