import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditBlog.css";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/blogs/blog/${id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        setBlog(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleUpdate = async () => {
    if (!blog.title.trim() || !blog.content.trim()) {
      alert("Title and content cannot be empty");
      return;
    }
    
    setSaving(true);
    try {
      await axios.put(`http://127.0.0.1:8000/api/blogs/blog/${id}/`, blog, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      setSaving(false);
      
      // Create notification element
      const notification = document.createElement("div");
      notification.className = "success-notification";
      notification.textContent = "Blog updated successfully!";
      document.body.appendChild(notification);
      
      // Remove notification after animation
      setTimeout(() => {
        notification.classList.add("fade-out");
        setTimeout(() => {
          document.body.removeChild(notification);
          navigate("/");
        }, 500);
      }, 2000);
      
    } catch (error) {
      console.error("Error updating blog:", error);
      setSaving(false);
      alert("Failed to update blog. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/editor");
  };

  if (loading) return (
    <div className="loading">
      Loading blog...
    </div>
  );

  return (
    <div className="edit-blog-container">
      <h2 className="edit-blog-title">Edit Blog</h2>
      <input
        type="text"
        value={blog.title}
        onChange={(e) => setBlog({ ...blog, title: e.target.value })}
        className="edit-blog-input"
        placeholder="Enter blog title"
      />
      <textarea
        value={blog.content}
        onChange={(e) => setBlog({ ...blog, content: e.target.value })}
        className="edit-blog-textarea"
        placeholder="Enter blog content"
      />
      <div className="edit-blog-actions">
        <button 
          onClick={handleUpdate} 
          className="edit-blog-button"
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Blog"}
        </button>
        <button onClick={handleCancel} className="edit-blog-cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditBlog;