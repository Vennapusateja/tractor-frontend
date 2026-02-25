import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TractorsPage from './pages/TractorsPage';
import BuyTractorsPage from './pages/BuyTractorsPage';
import TractorDetail from './pages/TractorDetail';
import BookingPage from './pages/BookingPage';
import BookingsListPage from './pages/BookingsListPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import AddTractorPage from './pages/AddTractorPage';
import EquipmentPage from './pages/EquipmentPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<TractorsPage />} />
          <Route path="/tractors" element={<TractorsPage />} />
          <Route path="/buy-tractors" element={<BuyTractorsPage />} />
          <Route path="/tractors/:id" element={<TractorDetail />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/book/:id" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><BookingsListPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/add-tractor" element={<PrivateRoute><AddTractorPage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;