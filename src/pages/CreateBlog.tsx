import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError("All fields are required.");
      return;
    }

    const blogData = { title, content };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/blogs/blog/",
        blogData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 201) {
        navigate("/editor");
      }
    } catch (err) {
      setError("There was an error creating the blog. Please try again.");
    }
  };

  return (
    <div className="blog-container">
      <div className="editor">
        <h2 className="editor-title">Create a New Blog</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="blog-form">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Title"
            className="blog-title"
          />

          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Tell your story..."
            className="blog-content"
          ></textarea>

          <button className="publish-button">Publish</button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
