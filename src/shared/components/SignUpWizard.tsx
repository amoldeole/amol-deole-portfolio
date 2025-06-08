import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000';

const SignUpWizard: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('profile');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    avatar: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!profile.firstName.trim() || !profile.lastName.trim() || !profile.email.trim() || !profile.password.trim()) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);

    try {
      let profilePicture = '';
      if (profile.avatar) {
        profilePicture = '';
      }

      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        password: profile.password,
        role: 'guest',
        profilePicture: profilePicture || 'https://support.hubstaff.com/wp-content/uploads/2019/08/good-pic-300x286.png',
        permissions: {},
        phone: phoneNumber
      };

      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Signup failed');
      }
      window.dispatchEvent(
        new CustomEvent('toast', {
          detail: {
            type: 'success',
            message: `Sign up successful, please login to continue.`,
          },
        })
      );
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // Handler for user icon click
  const handleUserIconClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative inline-block mb-4 cursor-pointer" onClick={handleUserIconClick}>
              <User className="w-24 h-24 md:w-28 md:h-28 text-gray-400 dark:text-gray-600 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full p-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 font-poppins">
              Sign Up
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete your profile to start chatting
            </p>
          </div>

          {step === 'profile' && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleProfileSubmit}
              className="space-y-6"
            >
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 bg-white dark:bg-gray-800"
                    placeholder="First Name"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 bg-white dark:bg-gray-800"
                    placeholder="Last Name"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    autoComplete="family-name"
                  />
                </div>
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 bg-white dark:bg-gray-800"
                    placeholder="Email address"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 bg-white dark:bg-gray-800"
                    placeholder="Password"
                    value={profile.password}
                    onChange={(e) => setProfile(prev => ({ ...prev, password: e.target.value }))}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? 'Registering...' : 'Complete Registration'}
              </button>

              <div className="text-center mt-4">
                <span className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-500 hover:underline">
                    Login here
                  </Link>
                </span>
              </div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpWizard;