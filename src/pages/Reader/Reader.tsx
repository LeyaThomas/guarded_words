import { useState, useEffect, ChangeEvent } from "react";
import { Flame, BookOpen, Search, MoreVertical, Check } from "lucide-react";
import { privateGateway } from "../../api/auth"; 
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; 
import "./Reader.css";

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  views: number;
}

const Reader: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [myReads, setMyReads] = useState<number[]>(() => {
    return JSON.parse(localStorage.getItem("myReads") || "[]");
  });
  const [showMyReads, setShowMyReads] = useState<boolean>(false);

  const handleBlogClick = (blogId: number) => {
    navigate(`/blog/${blogId}`); // Navigate to BlogDetails page
  };

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await privateGateway.get("/blogs/streak/");
        if (response.status === 200) {
          setStreak(response.data.streak_count);
        }
      } catch (error) {
        console.error("Error fetching streak data:", error);
        toast.error("Failed to load streak data.");
      }
    };

    fetchStreak();
  }, []);


  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await privateGateway.get("/blogs/blog/");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to load blogs. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleMenuToggle = (blogId: number) => {
    setMenuOpen(menuOpen === blogId ? null : blogId);
  };

  const handleMarkAsRead = (blogId: number) => {
    if (!myReads.includes(blogId)) {
      const updatedReads = [...myReads, blogId];
      setMyReads(updatedReads);
      localStorage.setItem("myReads", JSON.stringify(updatedReads));
    }
    setMenuOpen(null);
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const myReadBlogs = blogs.filter((blog) => myReads.includes(blog.id));

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="reader">
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
              <button className="my-reads-button" onClick={() => setShowMyReads(!showMyReads)}>
                <BookOpen size={20} />
                <span>My Reads</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="container main-content">
        <h2 className="main-title">{showMyReads ? "My Reads" : "All Blogs"}</h2>
        <div className="blog-grid">
          {(showMyReads ? myReadBlogs : filteredBlogs).length > 0 ? (
            (showMyReads ? myReadBlogs : filteredBlogs).map((blog) => (
              <div className="blog-card" key={blog.id} onClick={() => handleBlogClick(blog.id)}>
                <div className="blog-content">
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-author">by {blog.author}</p>
                  <p className="blog-date">📅 {formatDate(blog.created_at)}</p>
                  <p className="blog-excerpt">
                    {blog.content.length > 100 ? blog.content.substring(0, 100) + "..." : blog.content}
                  </p>
                  <p className="blog-views">👀 {blog.views} views</p>
                </div>
                <div className="menu-container">
                  <MoreVertical size={20} className="menu-icon" onClick={() => handleMenuToggle(blog.id)} />
                  {menuOpen === blog.id && (
                    <div className="menu-dropdown">
                      <button onClick={() => handleMarkAsRead(blog.id)}>
                        <Check size={16} /> Mark as Read
                      </button>
                    </div>
                  )}
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

export default Reader;
