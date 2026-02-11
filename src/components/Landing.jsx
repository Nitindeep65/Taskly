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
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
        @media (prefers-reduced-motion) {
          .animate-pulse {
            animation: none;
          }
        }
      `}</style>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-700' 
          : 'bg-gray-50'
      }`}>
      {/* Navigation Header */}
      <nav className={`border-b sticky top-0 z-50 transition-colors duration-300 backdrop-blur-lg ${
        isDarkMode 
          ? 'bg-gray-700/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-blue-600">
                Taskly
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
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
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={goToSignup}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
                  isDarkMode 
                    ? 'bg-gray-800 text-blue-300 border-gray-600' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  ✨ New: Real-time collaboration features
                </div>
                <h1 className={`text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Organize Your
                  <span className="block text-blue-600">
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
                  className="group px-10 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
                  className={`px-10 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
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
                    <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-500"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span className="font-semibold">10,000+</span> happy users
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 20 20">
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
              <div className={`relative rounded-2xl shadow-xl p-8 transition-all duration-700 border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } hover:shadow-2xl`}>
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-lg"></div>
                      <span className={`font-bold text-lg ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Taskly Dashboard</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    {/* Todo Column */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span className={`font-semibold text-sm ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>To Do</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>3</span>
                      </div>
                      <div className={`border-l-4 border-gray-400 p-4 rounded-lg shadow-sm transition-transform hover:scale-105 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>Fix critical security bug</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                          }`}>priority</span>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                      <div className={`border-l-4 border-gray-400 p-4 rounded-lg shadow-sm ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>Client presentation</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>meeting</span>
                      </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className={`font-semibold text-sm ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>In Progress</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                        }`}>2</span>
                      </div>
                      <div className={`border-l-4 border-blue-500 p-4 rounded-lg shadow-sm ${
                        isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>Design system updates</p>
                        <div className={`w-full rounded-full h-2 mb-2 ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                        }`}>60% done</span>
                      </div>
                      <div className={`border-l-4 border-blue-500 p-4 rounded-lg shadow-sm ${
                        isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>API integration</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                        }`}>ongoing</span>
                      </div>
                    </div>

                    {/* Completed Column */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                        <span className={`font-semibold text-sm ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>Completed</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>4</span>
                      </div>
                      <div className={`border-l-4 border-gray-600 p-4 rounded-lg shadow-sm opacity-70 ${
                        isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 line-through ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Database setup</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                          }`}>completed</span>
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className={`border-l-4 border-gray-600 p-4 rounded-lg shadow-sm opacity-70 ${
                        isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 line-through ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>User authentication</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

export default Landing;