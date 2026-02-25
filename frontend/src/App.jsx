import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyForm from './pages/CompanyForm';
import Users from './pages/Users';
import ManagerForm from './pages/ManagerForm';
import Workers from './pages/Workers';
import Machines from './pages/Machines';
import MachineForm from './pages/MachineForm';
import POS from './pages/POS';
import './i18n';

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={user.role === 'admin' ? <Companies /> : <Navigate to="/" />} />
          <Route path="/companies/add" element={user.role === 'admin' ? <CompanyForm /> : <Navigate to="/" />} />
          <Route path="/companies/edit/:id" element={user.role === 'admin' ? <CompanyForm /> : <Navigate to="/" />} />
          <Route path="/managers" element={user.role === 'admin' ? <Users /> : <Navigate to="/" />} />
          <Route path="/managers/add" element={user.role === 'admin' ? <ManagerForm /> : <Navigate to="/" />} />
          <Route path="/managers/edit/:id" element={user.role === 'admin' ? <ManagerForm /> : <Navigate to="/" />} />
          <Route path="/users" element={user.role === 'company_manager' ? <Users /> : <Navigate to="/" />} />
          <Route path="/workers" element={user.role === 'company_manager' ? <Workers /> : <Navigate to="/" />} />
          <Route path="/machines" element={user.role === 'company_manager' ? <Machines /> : <Navigate to="/" />} />
          <Route path="/machines/add" element={user.role === 'company_manager' ? <MachineForm /> : <Navigate to="/" />} />
          <Route path="/machines/edit/:id" element={user.role === 'company_manager' ? <MachineForm /> : <Navigate to="/" />} />
          <Route path="/pos" element={<POS />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
