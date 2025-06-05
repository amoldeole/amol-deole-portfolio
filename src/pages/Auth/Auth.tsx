import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, User, Camera } from 'lucide-react';

const Auth: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    avatar: null as File | null
  });

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('profile');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration complete');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to ChatApp
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'phone' && 'Enter your phone number to get started'}
            {step === 'otp' && 'Enter the verification code sent to your phone'}
            {step === 'profile' && 'Complete your profile to start chatting'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'phone' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step !== 'phone' ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'otp' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step === 'profile' ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Phone Number Step */}
        {step === 'phone' && (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handlePhoneSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Send Verification Code
            </button>
          </motion.form>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleOtpSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                Resend Code
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Verify Code
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2"
            >
              Back to Phone Number
            </button>
          </motion.form>
        )}

        {/* Profile Step */}
        {step === 'profile' && (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleProfileSubmit}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                  {profile.avatar ? (
                    <img
                      src={URL.createObjectURL(profile.avatar)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white"
                >
                  <Camera className="w-3 h-3" />
                </button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfile(prev => ({ ...prev, avatar: file }));
                    }
                  }}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Complete Registration
            </button>

            <button
              type="button"
              onClick={() => setStep('otp')}
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2"
            >
              Back to Verification
            </button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;