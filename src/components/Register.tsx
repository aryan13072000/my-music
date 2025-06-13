import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+])[A-Za-z\d@$!%*?&#^()_+]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email and password
    const isEmailValid = validateEmail(form.email);
    const isPasswordValid = validatePassword(form.password);

    if (!isEmailValid) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }

    if (!isPasswordValid) {
      setPasswordError(
        'Min 8 chars, include upper/lowercase, number & special char'
      );
    } else {
      setPasswordError('');
    }

    if (!isEmailValid || !isPasswordValid) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.find((user: any) => user.email === form.email);

    if (exists) {
      alert('User already exists');
      return;
    }

    users.push(form);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful!');
    login(form.email);
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            margin="normal"
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            margin="normal"
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
