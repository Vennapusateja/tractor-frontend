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
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import AddTractorPage from './pages/AddTractorPage';
import EquipmentPage from './pages/EquipmentPage';
import HomePage from './pages/HomePage';
import ReviewsPage from './pages/ReviewsPage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tractors" element={<TractorsPage />} />
          <Route path="/buy-tractors" element={<BuyTractorsPage />} />
          <Route path="/tractors/:id" element={<TractorDetail />} />
          <Route path="/tractors/:id/reviews" element={<ReviewsPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/book/:id" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><BookingsPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/add-tractor" element={<PrivateRoute><AddTractorPage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;