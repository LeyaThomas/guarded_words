import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Reader from "./pages/Reader/Reader";
import Editor from "./pages/Editor/Editor";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails/BlogDetails";
import EditBlog from "./pages/Editor/EditBlog";
// import Dashboard from "./pages/Dashboard";  // Import Dashboard

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reader" element={<Reader />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/edit-blog/:id" element={<EditBlog />} />
        
        {/* Dashboard Route
        <Route path="/dashboard" element={<Dashboard />} /> */}


        {/* Redirect unknown routes to Login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
