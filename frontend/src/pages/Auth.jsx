import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (mode === "register" && form.username.trim().length < 3) {
      errs.username = "Username must be at least 3 characters";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");
    if (!validate()) return;

    try {
      if (mode === "register") {
        await register(form.username, form.email, form.password);
        setServerMessage("Registration successful! Please log in.");
        setMode("login");
        setForm({ username: "", email: form.email, password: "" });
      } else {
        await login(form.email, form.password);
        navigate("/");
      }
    } catch (err) {
      setServerMessage(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>

        <form onSubmit={handleSubmit} noValidate>
          {mode === "register" && (
            <div className="form-group">
              <label>Username</label>
              <input name="username" value={form.username} onChange={handleChange} />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {serverMessage && <p className="server-message">{serverMessage}</p>}

          <button type="submit" className="btn-primary full-width">
            {mode === "login" ? "Sign In" : "Register"}
          </button>
        </form>

        <p className="auth-toggle">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setErrors({});
              setServerMessage("");
            }}
          >
            {mode === "login" ? "Register" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;