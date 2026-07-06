// ============================================================================
// BROCAADE MES - REACT FRONTEND APPLICATION
// Complete Responsive Web & Mobile Application
// ============================================================================

import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// ============================================================================
// CONTEXT FOR AUTHENTICATION & GLOBAL STATE
// ============================================================================

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setUser(JSON.parse(localStorage.getItem('user')));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token: newToken, user: userData } = response.data;
    
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, login, logout, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

// ============================================================================
// PROTECTED ROUTE
// ============================================================================

const ProtectedRoute = ({ requiredRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// ============================================================================
// LOGIN PAGE
// ============================================================================

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Brocaade MES</h1>
        <p className="text-center text-gray-600 mb-6">Interior & Manufacturing Workflow</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 bg-blue-50 p-4 rounded text-sm text-gray-700">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Owner: owner@brocaade.com / SecurePass123!</p>
          <p>Design: design@brocaade.com / DesignPass123!</p>
          <p>Manager: manager@brocaade.com / ManagerPass123!</p>
          <p>Contractor: contractor@brocaade.com / ContractorPass123!</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SIDEBAR NAVIGATION
// ============================================================================

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const navigationItems = {
    owner: [
      { label: 'Dashboard', path: '/dashboard', icon: '📊' },
      { label: 'Projects', path: '/projects', icon: '📋' },
      { label: 'All Job Sheets', path: '/job-sheets', icon: '📝' },
      { label: 'Contractors', path: '/contractors', icon: '👷' },
      { label: 'SLA Alerts', path: '/sla-alerts', icon: '⚠️' },
      { label: 'Master Data', path: '/master-data', icon: '🗄️' },
      { label: 'Company Settings', path: '/company-settings', icon: '⚙️' },
    ],
    design_head: [
      { label: 'My Projects', path: '/projects', icon: '📋' },
      { label: 'Create Job Sheet', path: '/job-sheets/create', icon: '✏️' },
      { label: 'Job Sheets', path: '/job-sheets', icon: '📝' },
    ],
    factory_manager: [
      { label: 'Job Queue', path: '/dashboard', icon: '📊' },
      { label: 'All Job Sheets', path: '/job-sheets', icon: '📝' },
      { label: 'Milestones', path: '/milestones', icon: '✅' },
      { label: 'SLA Monitoring', path: '/sla-alerts', icon: '⚠️' },
    ],
    contractor: [
      { label: 'My Dashboard', path: '/dashboard', icon: '📊' },
      { label: 'My Jobs', path: '/job-sheets', icon: '📝' },
      { label: 'Earnings', path: '/contractor/earnings', icon: '💰' },
    ],
    delivery_team: [
      { label: 'Deliveries', path: '/deliveries', icon: '🚚' },
      { label: 'COD Collections', path: '/collections', icon: '💳' },
    ],
  };

  const items = navigationItems[user?.role] || [];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 hidden md:block fixed h-screen overflow-y-auto`}>
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h2 className="text-xl font-bold">Brocaade</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:bg-gray-700 p-2 rounded"
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>

      <nav className="mt-8">
        {items.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="flex items-center space-x-3 px-6 py-3 hover:bg-gray-700 transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </a>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-gray-700 p-4">
        <div className={`${isOpen && 'mb-4'}`}>
          {isOpen && <p className="text-sm text-gray-400">{user?.email}</p>}
        </div>
        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm"
        >
          {isOpen ? 'Logout' : '🚪'}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// OWNER DASHBOARD
// ============================================================================

const OwnerDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [slaAlerts, setSlaAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, slaRes] = await Promise.all([
          axios.get('/api/owner/dashboard-summary', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/sla-alerts', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSummary(summaryRes.data);
        setSlaAlerts(slaRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Owner Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm">Active Jobs</p>
          <p className="text-3xl font-bold text-blue-600">{summary?.active_jobs || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <p className="text-gray-600 text-sm">Pipeline Value</p>
          <p className="text-3xl font-bold text-green-600">₹{(summary?.pipeline_value || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-600">
          <p className="text-gray-600 text-sm">Contractor Liabilities</p>
          <p className="text-3xl font-bold text-orange-600">₹{(summary?.total_outstanding_liabilities || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
          <p className="text-gray-600 text-sm">Pending COD</p>
          <p className="text-3xl font-bold text-purple-600">₹{(summary?.pending_cod_value || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* SLA Alerts */}
      {slaAlerts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ SLA Breach Alerts ({slaAlerts.length})</h2>
          <div className="space-y-2">
            {slaAlerts.map((alert) => (
              <div
                key={alert.job_id}
                className="p-4 border-l-4 border-red-600 bg-red-50 rounded flex justify-between items-center animate-pulse"
              >
                <div>
                  <p className="font-semibold text-gray-800">{alert.job_number}</p>
                  <p className="text-sm text-gray-600">{alert.milestone_name}</p>
                  <p className="text-xs text-gray-500">
                    {Math.floor(alert.hours_elapsed)}h elapsed (SLA: {alert.sla_hours}h)
                  </p>
                </div>
                <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PROJECT MANAGEMENT
// ============================================================================

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    project_name: '',
    project_type: 'interior_renovation',
    client_name: '',
    client_phone: '',
    client_email: '',
    client_address: '',
    client_city: '',
    project_start_date: '',
    project_end_date: '',
    budget_amount: '',
  });
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({
        project_name: '',
        project_type: 'interior_renovation',
        client_name: '',
        client_phone: '',
        client_email: '',
        client_address: '',
        client_city: '',
        project_start_date: '',
        project_end_date: '',
        budget_amount: '',
      });
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project: ' + error.response?.data?.error);
    }
  };

  if (loading) return <div className="p-8">Loading projects...</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        {(user?.role === 'owner' || user?.role === 'design_head') && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            + New Project
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Create New Project</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Name"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              required
            />

            <select
              value={formData.project_type}
              onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="manufacturing">Manufacturing</option>
              <option value="interior_renovation">Interior Renovation</option>
              <option value="mixed">Mixed</option>
            </select>

            <input
              type="text"
              placeholder="Client Name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              required
            />

            <input
              type="tel"
              placeholder="Client Phone"
              value={formData.client_phone}
              onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="email"
              placeholder="Client Email"
              value={formData.client_email}
              onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              placeholder="Client Address"
              value={formData.client_address}
              onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              placeholder="City"
              value={formData.client_city}
              onChange={(e) => setFormData({ ...formData, client_city: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="number"
              placeholder="Budget Amount"
              value={formData.budget_amount}
              onChange={(e) => setFormData({ ...formData, budget_amount: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="date"
              value={formData.project_start_date}
              onChange={(e) => setFormData({ ...formData, project_start_date: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="date"
              value={formData.project_end_date}
              onChange={(e) => setFormData({ ...formData, project_end_date: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 w-full"
          >
            Create Project
          </button>
        </form>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-gray-800">{project.project_name}</h3>
            <p className="text-gray-600 text-sm mt-1">Type: {project.project_type}</p>
            <p className="text-gray-600 text-sm">Client: {project.client_name}</p>
            <p className="text-gray-600 text-sm">Budget: ₹{(project.budget_amount || 0).toLocaleString()}</p>
            <a
              href={`/projects/${project.id}/job-sheets`}
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold"
            >
              View Jobs →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// JOB SHEETS
// ============================================================================

const JobSheetsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/job-sheets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  if (loading) return <div className="p-8">Loading job sheets...</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Job Sheets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{job.job_number}</p>
                <h3 className="text-lg font-bold text-gray-800">{job.job_type}</h3>
                <p className="text-gray-600 text-sm mt-1">Status: {job.status}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                job.status === 'completed' ? 'bg-green-100 text-green-800' :
                job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {job.status}
              </span>
            </div>

            {job.promised_delivery_date && (
              <p className="text-gray-600 text-sm mt-2">
                Delivery: {new Date(job.promised_delivery_date).toLocaleDateString()}
              </p>
            )}

            <a
              href={`/job-sheets/${job.id}`}
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold"
            >
              View Details →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// CONTRACTOR DASHBOARD
// ============================================================================

const ContractorDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, earningsRes] = await Promise.all([
          axios.get('/api/job-sheets', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/contractor/financial-summary', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setJobs(jobsRes.data);
        setEarnings(earningsRes.data);
      } catch (error) {
        console.error('Error fetching contractor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>

      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Potential Earnings</p>
          <p className="text-2xl font-bold text-blue-600">₹{(earnings?.total_potential_earnings || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Total Earned</p>
          <p className="text-2xl font-bold text-green-600">₹{(earnings?.total_earned_amount || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Advances Paid</p>
          <p className="text-2xl font-bold text-orange-600">₹{(earnings?.total_advances_paid || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-purple-600">
          <p className="text-gray-600 text-sm">Balance Due</p>
          <p className="text-2xl font-bold text-purple-600">₹{(earnings?.total_balance_due || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Active Jobs */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Active Jobs</h2>
        <div className="space-y-3">
          {jobs.filter(j => j.status !== 'completed').map((job) => (
            <div key={job.id} className="p-4 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-800">{job.job_type}</p>
              <p className="text-sm text-gray-600">{job.job_number}</p>
              <a href={`/job-sheets/${job.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-2">
                View Job →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPANY SETTINGS (Owner Only)
// ============================================================================

const CompanySettingsPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    company_name: '',
    logo_url: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
    email: '',
    tax_id: '',
    currency_symbol: '₹',
  });
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/company/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/company/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Company profile updated successfully');
    } catch (error) {
      alert('Error updating profile: ' + error.response?.data?.error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Company Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            placeholder="Logo URL"
            value={formData.logo_url || ''}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            placeholder="Address"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            placeholder="City"
            value={formData.city || ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            placeholder="State"
            value={formData.state || ''}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            placeholder="Postal Code"
            value={formData.postal_code || ''}
            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            placeholder="Country"
            value={formData.country || ''}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            placeholder="Tax ID"
            value={formData.tax_id || ''}
            onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            placeholder="Currency Symbol"
            value={formData.currency_symbol}
            onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
            maxLength="5"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

// ============================================================================
// UNAUTHORIZED PAGE
// ============================================================================

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">403</h1>
        <p className="text-gray-600 mb-6">You don't have permission to access this page</p>
        <a href="/dashboard" className="text-blue-600 hover:text-blue-800 font-semibold">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRoles={['owner', 'factory_manager', 'contractor', 'design_head']}>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 md:ml-64">
                      {/* Role-based dashboard routing would go here */}
                      <OwnerDashboard />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects"
              element={
                <ProtectedRoute requiredRoles={['owner', 'design_head']}>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 md:ml-64">
                      <ProjectsPage />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/job-sheets"
              element={
                <ProtectedRoute requiredRoles={['owner', 'design_head', 'factory_manager', 'contractor']}>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 md:ml-64">
                      <JobSheetsPage />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/company-settings"
              element={
                <ProtectedRoute requiredRoles={['owner']}>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 md:ml-64">
                      <CompanySettingsPage />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
