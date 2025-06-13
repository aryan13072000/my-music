import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+])[A-Za-z\d@$!%*?&#^()_+]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(form.email);
    const isPasswordValid = validatePassword(form.password);

    setEmailError(isEmailValid ? "" : "Invalid email format");
    setPasswordError(
      isPasswordValid
        ? ""
        : "Min 8 chars, include upper/lowercase, number & special char"
    );

    if (!isEmailValid || !isPasswordValid) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const matched = users.find(
      (user: any) =>
        user.email === form.email && user.password === form.password
    );

    if (!matched) {
      alert("Invalid credentials. Redirecting to Register page...");
      navigate("/register");
      return;
    }

    login(form.email);
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
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
            Login
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate("/register")}
          >
            Don't have an account? Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
