import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from "axios"
import Footer from './common/Footer';
import auth from '../config/firebase'

function Blogs() {

    const [blogs, setBlogs] = useState([]);
    const [admin ,setAdmin] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0);
       
         auth.onAuthStateChanged((user) => {
      if (user){
       if(user.uid === "CHQQr3y4r6aoye0KKQSQ72oZv7n2"){
        setAdmin(true)
console.log("he is admin")
      }else{
          setAdmin(false)
        console.log("not a admin")
      }}
      else{
      
         console.log("user logged out");
      }    });

        axios.get("/api/blogs").then((res) => {
            console.log(res.data)
            setBlogs(res.data)
        }).catch(() => {
            console.log("Error fetching data")
        })


    }, [])



    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [editingBlogId, setEditingBlogId] = useState(null);
    const [blogError, setBlogError] = useState('');


    const handleLike = async (blog_id) => {
        try {
            const response = await axios.patch(`/api/blogs/like/${blog_id}`);
            // After successfully updating the likes count in the backend, fetch the updated list of blogs
            if (response.status === 200) {
                axios.get("/api/blogs").then((res) => {
                    console.log(res.data)
                    setBlogs(res.data)
                }).catch(() => {
                    console.log("Error fetching data")
                })
            }
        } catch (error) {
            console.error('Error liking the blog post:', error);
        }
    };

    const handleNewBlogSubmit = async (event) => {
        event.preventDefault();
        setBlogError('');

        try {
            if (editingBlogId) {
                await axios.put(`/api/blogs/${editingBlogId}`, { newTitle, newContent });
            } else {
                const today = new Date();
                const date = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                await axios.post("/api/blogs", { newTitle, date, newContent, likes: 0 });
            }

            const response = await axios.get("/api/blogs");
            setBlogs(response.data);
            setNewTitle('');
            setNewContent('');
            setEditingBlogId(null);
        } catch (error) {
            setBlogError('Unable to save the blog post. Please try again.');
        }
    };

    const handleEditBlog = (blog) => {
        setEditingBlogId(blog._id);
        setNewTitle(blog.newTitle);
        setNewContent(blog.newContent);
        setBlogError('');
    };

    const handleDeleteBlog = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this blog post?')) {
            return;
        }

        setBlogError('');
        try {
            await axios.delete(`/api/blogs/${blogId}`);
            setBlogs((currentBlogs) => currentBlogs.filter((blog) => blog._id !== blogId));
            if (editingBlogId === blogId) {
                setEditingBlogId(null);
                setNewTitle('');
                setNewContent('');
            }
        } catch (error) {
            setBlogError('Unable to delete the blog post. Please try again.');
        }
    };

    return (
        <div className="blog-section py-14">
            <h2 className="text-center text-5xl font-bold mb-14">Latest  <span className='text-orange-400'>Blogs</span> 📚</h2>

            {/* Blog creation form */}
            {admin? <div className="blog-creation-form mb-8" style={{ width: "80%", margin: "auto" }}>
                <form onSubmit={handleNewBlogSubmit} className="flex flex-col gap-4">
                    {blogError && <p className="text-red-500" role="alert">{blogError}</p>}
                    <input
                        type="text"
                        placeholder="Blog Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="p-2 border rounded"
                        required
                    />
                    <textarea
                        placeholder="Blog Content"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="p-2 border rounded"
                        rows="4"
                        required
                    />
                    <button type="submit" className="bg-orange-400 text-white p-2 rounded hover:bg-orange-600">
                        {editingBlogId ? 'Save Changes' : 'Add Blog'}
                    </button>
                    {editingBlogId && <button type="button" className="border p-2 rounded" onClick={() => {
                        setEditingBlogId(null);
                        setNewTitle('');
                        setNewContent('');
                    }}>Cancel</button>}
                </form>
            </div>:""}
           

            <div className="blogs-container grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto px-4">
                {blogs.map((blog) => (
                    <div key={blog._id} className="blog-post mb-8 p-6 bg-white shadow-lg rounded-lg">
                        <h3 className="blog-title font-semibold text-2xl text-gray-800 mb-3">{blog.newTitle}</h3>
                        <p className="blog-date text-gray-400 text-sm mb-4">{blog.date}</p>
                        <p className="blog-content text-gray-600 mb-4">{blog.newContent}</p>
                        <span className="text-blue-500 cursor-pointer" onClick={() => handleLike(blog._id)}>Like</span>
                        <span className="ml-2">{blog.likes} Likes</span>
                        {admin && <div className="mt-4 flex gap-3">
                            <button type="button" className="text-blue-600 hover:underline" onClick={() => handleEditBlog(blog)}>Edit</button>
                            <button type="button" className="text-red-600 hover:underline" onClick={() => handleDeleteBlog(blog._id)}>Delete</button>
                        </div>}
                    </div>
                ))}
            </div>

            <Footer/>
        </div>
    );
}

export default Blogs