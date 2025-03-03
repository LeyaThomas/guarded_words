import { useState, ChangeEvent } from "react";
import { Flame, BookOpen, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom"; // Importing useNavigate

const Editor: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate(); // Initializing useNavigate

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleCreateBlog = () => {
    // Navigate to the create blog page
    navigate("/create-blog"); // Redirect to "/create" route when the button is clicked
  };

  return (
    <header className="reader-header">
      {/* Top Bar */}
      <div className="top-bar">
        {/* Logo */}
        <h1 className="logo">GuardedWords</h1>

        {/* Search Bar */}
        <div className="search-container">
          <Search className="search_button" size={20} />
          <input
            type="text"
            placeholder="Search by author's name..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Streaks & Create Blog */}
        <div className="streaks-my-reads">
          {/* Streaks */}
          <div className="streaks">
            <Flame size={20} />
            <span>3 Days Streak</span>
          </div>

          {/* Create Blog */}
          <button className="my-reads-button" onClick={handleCreateBlog}>
            <BookOpen size={20} />
            Create Blog
          </button>
        </div>
      </div>

      {/* Trending Blogs Section */}
      <div className="trending-section">
        <h2 className="trending-title">🔥 Trending Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Example Trending Blogs */}
          <div className="trending-blog-card">
            <h3 className="trending-blog-title">Understanding Web Security</h3>
            <p className="trending-blog-author">by John Doe</p>
          </div>
          <div className="trending-blog-card">
            <h3 className="trending-blog-title">React Performance Optimization</h3>
            <p className="trending-blog-author">by Jane Smith</p>
          </div>
          <div className="trending-blog-card">
            <h3 className="trending-blog-title">AI in Blogging: Future Trends</h3>
            <p className="trending-blog-author">by Alex Johnson</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Editor;
