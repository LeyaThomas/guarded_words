import { useState, ChangeEvent } from "react";
import { Flame, BookOpen, Search } from 'lucide-react';


const Reader: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
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

        {/* Streaks & My Reads */}
        <div className="streaks-my-reads">
          {/* Streaks */}
          <div className="streaks">
            <Flame size={20} />
            <span>3 Days Streak</span>
          </div>

          {/* My Reads */}
          <button className="my-reads-button">
            <BookOpen size={20} />
            My Reads
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

export default Reader;
