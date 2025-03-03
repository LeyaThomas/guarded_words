import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios'; // For making API requests

const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate(); // Using useNavigate

  // Handle title input change
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Handle content input change
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Handle category input change
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError('All fields are required.');
      return;
    }

    const accessToken = localStorage.getItem('access_token');
     console.log('Access Token:', accessToken); // 🔍 Debugging log
    const blogData = {
      title,
      content,
    
    };

    try {
      // Post data to the backend API (make sure your Django API is set up to handle POST requests for blogs)
      const response = await axios.post('http://127.0.0.1:8000/api/blogs/blog/', blogData, {
        headers: {
          
          Authorization: `Bearer ${localStorage.getItem('access_token')}`, 
        },
      });

      if (response.status === 201) {
        navigate('/editor'); // Redirect to Editor page after success
      }
    } catch (err) {
      setError('There was an error creating the blog. Please try again.');
    }
  };

  return (
    <div className="create-blog-container">
      <h2>Create a New Blog</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter the title"
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            placeholder="Enter the content"
          />
        </div>
        
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateBlog;
