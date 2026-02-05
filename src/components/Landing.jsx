import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

function Landing() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/signup');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Navigation Header */}
      <nav className={`border-b sticky top-0 z-50 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700' 
          : 'bg-white/80 backdrop-blur-sm border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Taskly
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={goToLogin}
                className={`px-4 py-2 font-medium transition-colors duration-200 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-blue-400' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={goToSignup}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Organize Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tasks Effortlessly
                </span>
              </h1>
              <p className={`text-lg md:text-xl mb-8 leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Stay productive with our intuitive kanban-style task management. 
                Drag, drop, and conquer your daily goals with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={goToSignup}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Start Free Today
                </button>
                <button
                  onClick={goToLogin}
                  className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className={`rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="grid grid-cols-3 gap-4">
                  {/* Urgent Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className={`font-semibold text-sm ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>Urgent</span>
                    </div>
                    <div className={`border-l-4 border-red-500 p-3 rounded-lg ${
                      isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
                    }`}>
                      <p className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>Fix critical bug</p>
                      <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full mt-2 inline-block">urgent</span>
                    </div>
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-800">Client meeting</p>
                      <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full mt-2 inline-block">urgent</span>
                    </div>
                  </div>

                  {/* In Progress Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-semibold text-sm text-gray-800">Progress</span>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-800">Design system</p>
                      <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full mt-2 inline-block">ongoing</span>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-800">API integration</p>
                      <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full mt-2 inline-block">ongoing</span>
                    </div>
                  </div>

                  {/* Completed Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-sm text-gray-800">Done</span>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-800 line-through">Setup database</p>
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full mt-2 inline-block">completed</span>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-800 line-through">User authentication</p>
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full mt-2 inline-block">completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Taskly?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make task management intuitive and efficient
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16l-1 10H5L4 7zM4 7l-1-3H1m4 4h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Drag & Drop</h3>
              <p className="text-gray-600">
                Effortlessly move tasks between columns with intuitive drag and drop functionality that works on all devices.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Ready</h3>
              <p className="text-gray-600">
                Fully responsive design that provides a seamless experience across desktop, tablet, and mobile devices.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time</h3>
              <p className="text-gray-600">
                Instant updates and synchronization ensure your tasks are always current across all your devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Organized?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of productive users who trust Taskly to manage their daily tasks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={goToSignup}
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Your Free Account
            </button>
            <button
              onClick={goToLogin}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              Already have an account?
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Taskly</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Simple. Powerful. Task Management.
            </p>
            <div className="text-sm text-gray-500">
              © 2026 Taskly. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;