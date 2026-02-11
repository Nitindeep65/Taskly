import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoginForm } from '@/components/login-form';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post("https://taskly-backend-iutv.onrender.com/auth/login", {
        email,
        password
      });
      console.log(res.data);
      
      // store token
      localStorage.setItem("token", res.data.token);
      // optional: store user
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // redirect to projects dashboard
      navigate("/projects");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
      console.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleLogin}
          onSignupClick={handleSignupClick}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default Login;