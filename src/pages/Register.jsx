import { useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../services/auth.services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeToggle from "../components/ThemeToggle";


const Register = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      navigate("/");
      toast.success("User created Successfully 🎉")
    } catch (err) {
      console.error("error :: creatingAcccount ::", err);
      toast.error(err.message)
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="center-min-h-screen">
      <div className="auth-card" role="main" aria-labelledby="register-heading">
        <header className="auth-header">
          <h1 id="register-heading">Create account</h1>
          <p className="auth-sub">Join us and start exploring.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
            <div className="field-group">
              <label htmlFor="username">User name</label>
              <input
                id="username"
                name="username"
                placeholder="Jane"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="auth-alt">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default Register;
