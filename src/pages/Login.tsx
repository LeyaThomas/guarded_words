import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            if (response.data && response.data.token) {
                const { access, refresh } = response.data.token;
                const role = response.data.role;
                const user = response.data.username
    
                localStorage.setItem("access_token", access);
                localStorage.setItem("refresh_token", refresh);
                localStorage.setItem("role", role);
                localStorage.setItem("user", user);
    
                alert("Login successful!");
    
                if (role === "author") {
                    navigate("/editor");
                } else if (role === "reader") {
                    navigate("/reader");
                } else {
                    navigate("/login");
                }
            } else {
                alert("Token not received");
            }
        } catch (error: any) { 
            console.error("Login error:", error);
            alert("Invalid credentials");
        }
    };
    
    

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Welcome Back</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                    />
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                <p className="signup-text">
                    Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
