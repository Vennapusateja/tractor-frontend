import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }    from './context/AuthContext';
import Navbar              from './components/Navbar';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import TractorsPage        from './pages/TractorsPage';
import BuyTractorsPage     from './pages/BuyTractorsPage';
import TractorDetail       from './pages/TractorDetail';
import BookingPage         from './pages/BookingPage';
import ProfilePage         from './pages/ProfilePage';
import DashboardPage       from './pages/DashboardPage';
import AddTractorPage      from './pages/AddTractorPage';
import EquipmentPage       from './pages/EquipmentPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"              element={<TractorsPage />} />
          <Route path="/tractors"      element={<TractorsPage />} />
          <Route path="/buy-tractors"  element={<BuyTractorsPage />} />
          <Route path="/tractors/:id"  element={<TractorDetail />} />
          <Route path="/book/:id"      element={<BookingPage />} />
          <Route path="/profile"       element={<ProfilePage />} />
          <Route path="/dashboard"     element={<DashboardPage />} />
          <Route path="/add-tractor"   element={<AddTractorPage />} />
          <Route path="/equipment"     element={<EquipmentPage />} />
          <Route path="/login"         element={<LoginPage />} />
          <Route path="/register"      element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;