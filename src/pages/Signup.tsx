import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";


const Signup = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("reader"); // Default role is 'reader'
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signup(email, username, password, role);
            alert("Signup successful! Please login.");
            navigate("/login");
        } catch (error) {
            alert("Signup failed. Try again.");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">Create Your Account</h2>
                <form onSubmit={handleSignup} className="signup-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="signup-input"
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="signup-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="signup-input"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="signup-input"
                    >
                        <option value="reader">Reader</option>
                        <option value="author">Author</option>
                    </select>
                    <button type="submit" className="signup-button">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
