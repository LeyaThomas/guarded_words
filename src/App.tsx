import { BrowserRouter as Router, Routes,Route } from "react-router-dom"; 
import './App.css'

import LandingPage from './pages/LandingPage';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Reader from "./pages/Reader";
import Editor from "./pages/Editor";
import CreateBlog from "./pages/CreateBlog";

function App() {
 
  return (
    <>
    <Router>
     <Routes>
       <Route path='/' element={<LandingPage/>}/>
       <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reader" element={<Reader />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/create-blog" element={<CreateBlog />} />
     </Routes>
      
    </Router>
      
    </>
  )
}

export default App
