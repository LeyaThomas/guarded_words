import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, BookOpen, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import { privateGateway } from "../../api/auth";
import toast from "react-hot-toast";
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loggedInUser = localStorage.getItem("user");

  const normalizeUsername = (username: string | null): string => {
    if (!username) return "";
    return username.replace(/-author$/, "").toLowerCase().trim();
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

  const handleCreateBlog = () => {
    navigate("/create-blog");
  };

  const handleMenuToggle = (blogId: number) => {
    setMenuVisible((prev) => ({ ...prev, [blogId]: !prev[blogId] }));
  };

  const handleEdit = (blogId: number) => {
    navigate(`/edit-blog/${blogId}`);
  };

  const handleDelete = async (blogId: number) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await privateGateway.delete(`/blogs/blog/${blogId}/`);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      toast.success("Blog deleted successfully.");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete the blog.");
    }
  };

  const handleBlogClick = (blogId: number) => {
    navigate(`/blog/${blogId}`);
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <span className="streak-text">{streak} days</span>
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
          {isLoading ? (
            <p>Loading blogs...</p>
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => {
              const normalizedLoggedInUser = normalizeUsername(loggedInUser);
              const normalizedBlogAuthor = normalizeUsername(blog.author);

              return (
                <div className="blog-card" key={blog.id} onClick={() => handleBlogClick(blog.id)}>
                  {normalizedLoggedInUser === normalizedBlogAuthor && (
                    <div className="menu-container">
                      <MoreVertical
                        size={20}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuToggle(blog.id);
                        }}
                        className="menu-icon"
                      />

                      {menuVisible[blog.id] && (
                        <div className="menu-options">
                          <button
                            className="edit-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(blog.id);
                            }}
                          >
                            <Edit size={16} /> Edit
                          </button>
                          <button
                            className="delete-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(blog.id);
                            }}
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

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
              );
            })
          ) : (
            <p className="error-text">No blogs available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Editor;