import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, BookOpen, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import "./Editor.css";

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  views: number;
}

const Editor: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [menuVisible, setMenuVisible] = useState<{ [key: number]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/blogs/streak/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });

        if (response.status === 200) {
          setStreak(response.data.streak_count);
        }
      } catch (error) {
        console.error("Error fetching streak data:", error);
        setError("Failed to load streak data.");
      }
    };

    fetchStreak();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found. Please log in.");

        const response = await axios.get("http://127.0.0.1:8000/api/blogs/blog/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to load blogs. Please log in again.");
      }
    };

    fetchBlogs();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleCreateBlog = () => {
    navigate("/create-blog");
  };

  const handleMenuToggle = (blogId: number) => {
    setMenuVisible((prev) => ({ ...prev, [blogId]: !prev[blogId] }));
  };

  const handleEdit = (blogId: number) => {
    console.log("Editing blog:", blogId);
    navigate(`/edit-blog/${blogId}`);
  };

  const handleDelete = async (blogId: number) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/blogs/blog/${blogId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError("Failed to delete the blog.");
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="reader">
      {/* Header Section */}
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">GuardedWords</h1>

          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search by author's name..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="header-actions">
              <div className="streak-container">
                <Flame size={20} className="streak-icon" />
                {error ? (
                  <span className="error-text">{error}</span>
                ) : streak !== null ? (
                  <span className="streak-text">{streak} Days Streak</span>
                ) : (
                  <span className="streak-text">Loading...</span>
                )}
              </div>
              <button className="my-reads-button" onClick={handleCreateBlog}>
                <BookOpen size={20} />
                <span>Create Blog</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="container main-content">
        <h2 className="main-title">All Blogs</h2>
        <div className="blog-grid">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                {/* Menu Button at Top-Right */}
                <div className="menu-container">
                  <MoreVertical
                    size={20}
                    onClick={() => handleMenuToggle(blog.id)}
                    className="menu-icon"
                  />
                  {menuVisible[blog.id] && (
                    <div className="menu-options">
                      <button className="edit-button" onClick={() => handleEdit(blog.id)}>
                        <Edit size={16} /> Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(blog.id)}>
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Blog Content */}
                <div className="blog-content">
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-author">by {blog.author}</p>
                  <p className="blog-date">📅 {formatDate(blog.created_at)}</p>
                  <p className="blog-excerpt">
                    {blog.content.length > 100 ? blog.content.substring(0, 100) + "..." : blog.content}
                  </p>
                  <p className="blog-views">👀 {blog.views} views</p>
                </div>
              </div>
            ))
          ) : (
            <p className="error-text">No blogs available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Editor;
