import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../services/auth.services";
import { toast } from "react-toastify";


const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      toast.success("User logged-in successfully")
      navigate("/");
    } catch (error) {
      const errorMessage = error.message;
      toast.error(errorMessage)
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="center-min-h-screen">
      <div className="auth-card" role="main" aria-labelledby="login-heading">
        <header className="auth-header">
          <h1 id="login-heading">Sign in</h1>
          <p className="auth-sub">Welcome back. We've missed you.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-alt">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
