import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

function Landing() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/signup');

  return (
    <>
      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        @media (prefers-reduced-motion) {
          .animate-gradient-x,
          .animate-pulse {
            animation: none;
          }
        }
      `}</style>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-black via-gray-950 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
      {/* Navigation Header */}
      <nav className={`border-b sticky top-0 z-50 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black/90 backdrop-blur-sm border-gray-800' 
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
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 -left-20 w-96 h-96 rounded-full opacity-10 ${
            isDarkMode ? 'bg-blue-500' : 'bg-blue-200'
          } blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-20 -right-20 w-96 h-96 rounded-full opacity-10 ${
            isDarkMode ? 'bg-purple-500' : 'bg-purple-200'
          } blur-3xl animate-pulse delay-1000`}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200 dark:from-blue-950/50 dark:to-purple-950/50 dark:text-blue-300 dark:border-blue-800">
                  ✨ New: Real-time collaboration features
                </div>
                <h1 className={`text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Organize Your
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                    Tasks Effortlessly
                  </span>
                </h1>
              </div>
              <p className={`text-xl md:text-2xl leading-relaxed max-w-2xl ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Transform your productivity with our intuitive kanban-style task management. 
                <span className="font-semibold text-blue-600">Drag, drop, and conquer</span> your daily goals with unprecedented ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={goToSignup}
                  className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Start Free Today
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <button
                  onClick={goToLogin}
                  className={`px-10 py-4 rounded-2xl font-semibold text-lg border-2 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  Sign In
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span className="font-semibold">10,000+</span> happy users
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className={`ml-2 text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative lg:scale-110">
              <div className={`relative rounded-3xl shadow-2xl p-8 transform hover:rotate-0 transition-all duration-700 border ${
                isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black border-gray-800' : 'bg-white border-gray-100'
              } hover:shadow-3xl`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                      <span className={`font-bold text-lg ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Taskly Dashboard</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    {/* Urgent Column */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className={`font-semibold text-sm ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>Urgent</span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full dark:bg-red-900/30 dark:text-red-400">3</span>
                      </div>
                      <div className={`border-l-4 border-red-500 p-4 rounded-xl shadow-lg transition-transform hover:scale-105 ${
                        isDarkMode ? 'bg-gradient-to-br from-red-950/20 to-red-900/10' : 'bg-gradient-to-br from-red-50 to-red-25'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>Fix critical security bug</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full dark:bg-red-900/50 dark:text-red-400">urgent</span>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className={`border-l-4 border-red-500 p-4 rounded-xl shadow-lg ${
                        isDarkMode ? 'bg-gradient-to-br from-red-950/20 to-red-900/10' : 'bg-gradient-to-br from-red-50 to-red-25'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>Client presentation</p>
                        <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full dark:bg-red-900/50 dark:text-red-400">urgent</span>
                      </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className={`font-semibold text-sm ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>In Progress</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full dark:bg-yellow-900/30 dark:text-yellow-400">2</span>
                      </div>
                      <div className={`border-l-4 border-yellow-500 p-4 rounded-xl shadow-lg ${
                        isDarkMode ? 'bg-gradient-to-br from-yellow-950/20 to-yellow-900/10' : 'bg-gradient-to-br from-yellow-50 to-yellow-25'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>Design system updates</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2 dark:bg-gray-700">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full dark:bg-yellow-900/50 dark:text-yellow-400">60% done</span>
                      </div>
                      <div className={`border-l-4 border-yellow-500 p-4 rounded-xl shadow-lg ${
                        isDarkMode ? 'bg-gradient-to-br from-yellow-950/20 to-yellow-900/10' : 'bg-gradient-to-br from-yellow-50 to-yellow-25'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>API integration</p>
                        <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full dark:bg-yellow-900/50 dark:text-yellow-400">ongoing</span>
                      </div>
                    </div>

                    {/* Completed Column */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className={`font-semibold text-sm ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>Completed</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">4</span>
                      </div>
                      <div className={`border-l-4 border-green-500 p-4 rounded-xl shadow-lg opacity-80 ${
                        isDarkMode ? 'bg-gradient-to-br from-green-950/20 to-green-900/10' : 'bg-gradient-to-br from-green-50 to-green-25'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 line-through ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Database setup</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full dark:bg-green-900/50 dark:text-green-400">completed</span>
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className={`border-l-4 border-green-500 p-4 rounded-xl shadow-lg opacity-80 ${
                        isDarkMode ? 'bg-gradient-to-br from-green-950/20 to-green-900/10' : 'bg-gradient-to-br from-green-50 to-green-25'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 line-through ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>User authentication</p>
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full dark:bg-green-900/50 dark:text-green-400">completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 lg:py-32 transition-colors duration-300 ${
        isDarkMode ? 'bg-gradient-to-b from-gray-950 to-black' : 'bg-gradient-to-b from-white to-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200 dark:from-blue-950/50 dark:to-purple-950/50 dark:text-blue-300 dark:border-blue-800 mb-6">
              🚀 Powerful Features
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Why Choose
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Taskly?
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Powerful features designed to make task management intuitive, efficient, and enjoyable for teams of all sizes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="group text-center">
              <div className={`relative p-8 rounded-3xl transition-all duration-500 group-hover:scale-105 ${
                isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
              } shadow-xl group-hover:shadow-2xl`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Intuitive Drag & Drop</h3>
                  <p className={`text-lg leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Effortlessly move tasks between columns with our smooth, responsive drag and drop that works flawlessly on all devices.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group text-center">
              <div className={`relative p-8 rounded-3xl transition-all duration-500 group-hover:scale-105 ${
                isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
              } shadow-xl group-hover:shadow-2xl`}>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Mobile Optimized</h3>
                  <p className={`text-lg leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Fully responsive design with touch-optimized controls that provide a seamless experience across all devices.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group text-center">
              <div className={`relative p-8 rounded-3xl transition-all duration-500 group-hover:scale-105 ${
                isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
              } shadow-xl group-hover:shadow-2xl`}>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Lightning Fast</h3>
                  <p className={`text-lg leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Optimistic UI updates and real-time synchronization ensure your tasks are always current with zero delays.
                  </p>
                </div>
              </div>
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
      <footer className={`py-16 transition-colors duration-300 ${
        isDarkMode ? 'bg-black border-t border-gray-800' : 'bg-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Taskly</h3>
            </div>
            <p className={`text-lg mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-400'
            }`}>
              Simple. Powerful. Task Management.
            </p>
            <div className={`border-t pt-8 text-sm ${
              isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-700 text-gray-500'
            }`}>
              <p>© 2026 Taskly. All rights reserved. Built with ❤️ for productivity.</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}

export default Landing;