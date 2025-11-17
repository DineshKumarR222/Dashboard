// src/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './mockApi';
import type { AuthProps } from './apiTypes';

const Login: React.FC<AuthProps> = ({ setAuth }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUser(username, password);
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      // In a real app, narrow down the error type
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Admin Portal</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input 
            style={styles.input}
            type="text" 
            placeholder="Username (admin)"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            style={styles.input}
            type="password" 
            placeholder="Password (password123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          {error && <p style={{color: 'red'}}>{error}</p>}
          
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2f5' },
  card: { padding: '40px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  input: { padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' },
  button: { padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Login;