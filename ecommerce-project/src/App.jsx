import { Routes, Route } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} /> {/* path="/" is the same as index */}
      <Route path="checkout" element={<div><h1>Checkout Page</h1></div>} />
    </Routes>
  )
}

export default App;
