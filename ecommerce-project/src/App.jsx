import { Routes, Route } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx';
import './App.css'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} /> {/* path="/" is the same as index */}
      <Route path="checkout" element={<CheckoutPage />} />
    </Routes>
  )
}

export default App;
