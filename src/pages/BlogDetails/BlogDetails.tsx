import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BlogDetails.css";
interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  views: number;
}

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/blogs/blog/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setError("Failed to load blog details.");
      }
    };

    fetchBlogDetails();
  }, [id]);

  if (error) return <p className="error-text">{error}</p>;
  if (!blog) return <p className="loading-text">Loading...</p>;

  return (
    <div className="blog-details-container">
      <div className="blog-header">
        <h1 className="blog-heading">{blog.title}</h1>
        <div className="blog-meta">
          <span className="blog-author">📝 {blog.author}</span>
          <span className="blog-date">📅 {new Date(blog.created_at).toLocaleDateString()}</span>
          
        </div>
      </div>
      <div className="blog-content">
        <p>{blog.content}</p>
      </div>
    </div>
  );
};

export default BlogDetails;