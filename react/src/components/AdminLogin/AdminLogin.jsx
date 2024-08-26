import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { print } from 'graphql';
import { useHistory, useNavigate } from 'react-router-dom'; // Assuming you are using React Router for navigation
import { ADMIN_LOGIN_QUERY } from '../GraphqlMutations/loginQuery';
import config from "../../config";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('AdminDevotion');
    if (user) {
        navigate('/');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username == '' || password == '') {
      alert('Please fill up all the fields');
    } else {
      setLoading(true);
      try {
        const response = await axios.post(`${config.API_URL}/graphql-server`, {
          query: print(ADMIN_LOGIN_QUERY),
          variables: {
            username: username,
            password: password,
          },
        });

        const successMessage = response.data.data.login;
        if (successMessage == null) {
          const errMessage = response.data.errors[0].message;
          if (errMessage == 'Invalid password') {
            alert('Password Incorrect');
          } else if (errMessage == 'Admin not found') {
            alert('Invalid username');
          } else {
            alert('An error occurred. Please try again.');
          }
        } else if (successMessage.username == 'admin') {
          alert('Login Successful');
          localStorage.setItem('AdminDevotion', successMessage);
          window.location.reload();
        } else {
          alert('An error occurred. Please try again.');
        }
        console.log(response);
      } catch (error) {
        console.error('Error during login:', error);
        alert('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div style={{ marginTop: '50px' }} className="flex items-center justify-center">
        <div style={{ backgroundColor: '#fff3' }} className="p-8 rounded shadow-md w-96">
          <h2 className="color-black text-2xl font-semibold mb-4">ADMIN LOGIN</h2>
          <p>Login Form for Admin Only!</p>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-300"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-300"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!loading && (
            <button type="button" className="button text-white px-4 py-2 rounded-md focus:outline-none" onClick={handleLogin}>
              Login
            </button>
          )}
          {loading && <p>Logging In.</p>}
        </div>
      </div>
    </>
  );
};

export default Login;
