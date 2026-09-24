import { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaPen, 
  FaTrash, 
  FaEye, 
  FaSearch, 
  FaTimes,
  FaTable, 
  FaTh, 
  FaCheck, 
  FaNewspaper,
  FaArrowLeft,
  FaFilter,
  FaExclamationTriangle
} from "react-icons/fa";
import { Link } from 'react-router-dom';
import { Layout, Outer, Footer } from "../../components";
import axios from '../../api/axios';

const INITIAL_POSTS = [
  {
    id: 1,
    title: "Kendrick Lamar Announces New Stadium Tour",
    description: "Kendrick Lamar has officially announced his upcoming world tour covering over 30 major cities.",
    portrait_image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
    categories_id: 1,
    category_name: "News",
    date: "2026-09-24",
    views: 1420,
    video_url: "https://www.youtube.com/watch?v=sample1"
  },
  {
    id: 2,
    title: "Top 10 Hip Hop Albums of 2026",
    description: "A comprehensive breakdown of the most influential rap and hip hop records released this year.",
    portrait_image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
    categories_id: 2,
    category_name: "Music",
    date: "2026-09-23",
    views: 2890,
    video_url: "https://www.youtube.com/watch?v=sample2"
  },
  {
    id: 3,
    title: "Drake & Future Drop Surprise Collaboration Single",
    description: "Fans react as Drake and Future unexpected drop a joint single late Thursday midnight.",
    portrait_image: "https://images.pexels.com/photos/2579043/pexels-photo-2579043.jpeg?auto=compress&cs=tinysrgb&w=800",
    categories_id: 1,
    category_name: "News",
    date: "2026-09-22",
    views: 3510,
    video_url: "https://www.youtube.com/watch?v=sample3"
  },
  {
    id: 4,
    title: "Behind The Beats: Producer Spotlight",
    description: "An exclusive look into the production techniques of industry-defining beatmakers.",
    portrait_image: "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800",
    categories_id: 3,
    category_name: "Videos",
    date: "2026-09-20",
    views: 940,
    video_url: "https://www.youtube.com/watch?v=sample4"
  }
];

const CATEGORIES = [
  { id: 1, name: "News" },
  { id: 2, name: "Music" },
  { id: 3, name: "Videos" },
  { id: 4, name: "Interviews" },
  { id: 5, name: "Events" }
];

const STORAGE_KEY = 'hiphop_admin_posts_v1';

const Admin = () => {
  // Posts State
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    portrait_image: '',
    categories_id: 1,
    category_name: 'News',
    video_url: '',
    date: new Date().toISOString().split('T')[0],
    views: 0
  });

  const [formErrors, setFormErrors] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load initial posts
  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        // First check local storage for user-managed data
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (isMounted) {
              setPosts(parsed);
              setLoading(false);
              return;
            }
          }
        }

        // Try API
        const res = await axios.get('/api/v1/user_web/posts/?page=1');
        let fetchedData = [];
        if (res.data?.data?.today && Array.isArray(res.data.data.today)) {
          fetchedData = res.data.data.today;
        } else if (Array.isArray(res.data?.data)) {
          fetchedData = res.data.data;
        } else if (Array.isArray(res.data)) {
          fetchedData = res.data;
        }

        if (fetchedData.length > 0) {
          const formatted = fetchedData.map((item, idx) => ({
            id: item.id || idx + 1,
            title: item.title || item.name || `Post ${idx + 1}`,
            description: item.description || item.des || 'No description provided.',
            portrait_image: item.portrait_image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
            categories_id: item.categories_id || 1,
            category_name: CATEGORIES.find(c => c.id === Number(item.categories_id))?.name || 'General',
            date: item.date || item.created_at || new Date().toISOString().split('T')[0],
            views: item.views || Math.floor(Math.random() * 500) + 50,
            video_url: item.video_url || ''
          }));
          if (isMounted) {
            setPosts(formatted);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formatted));
          }
        } else {
          if (isMounted) {
            setPosts(INITIAL_POSTS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
          }
        }
      } catch (err) {
        console.warn('API fetch warning, loading local/initial posts state:', err.message);
        if (isMounted) {
          setPosts(INITIAL_POSTS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save posts to localStorage on change
  const savePostsToStorage = (updatedPosts) => {
    setPosts(updatedPosts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    } catch (e) {
      console.error('Failed to save posts to localStorage:', e);
    }
  };

  // Open Form for Adding New Post
  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentPost(null);
    setFormData({
      title: '',
      description: '',
      portrait_image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
      categories_id: 1,
      category_name: 'News',
      video_url: '',
      date: new Date().toISOString().split('T')[0],
      views: 0
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Open Form for Editing Existing Post
  const handleOpenEdit = (post) => {
    setIsEditing(true);
    setCurrentPost(post);
    setFormData({
      title: post.title || '',
      description: post.description || '',
      portrait_image: post.portrait_image || '',
      categories_id: post.categories_id || 1,
      category_name: post.category_name || CATEGORIES.find(c => c.id === Number(post.categories_id))?.name || 'News',
      video_url: post.video_url || '',
      date: post.date || new Date().toISOString().split('T')[0],
      views: post.views || 0
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Open Post Details Modal
  const handleOpenDetail = (post) => {
    setCurrentPost(post);
    setIsDetailOpen(true);
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (post) => {
    setCurrentPost(post);
    setIsDeleteOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required.';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required.';
    }
    if (!formData.portrait_image.trim()) {
      errors.portrait_image = 'Image URL is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Create / Update Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setActionLoading(true);

    const targetCategory = CATEGORIES.find(c => Number(c.id) === Number(formData.categories_id)) || { id: 1, name: 'News' };
    const payload = {
      ...formData,
      categories_id: Number(targetCategory.id),
      category_name: targetCategory.name,
      views: Number(formData.views) || 0
    };

    try {
      if (isEditing && currentPost) {
        // Try API endpoint (fallback to local state update if backend endpoint isn't live)
        try {
          await axios.put(`/api/v1/admin/posts/${currentPost.id}`, payload);
        } catch (apiErr) {
          console.warn('API endpoint unavailable for update, updating locally:', apiErr.message);
        }

        const updated = posts.map(p => (p.id === currentPost.id ? { ...p, ...payload } : p));
        savePostsToStorage(updated);
        showToast(`Post "${payload.title}" updated successfully!`, 'success');
      } else {
        const newId = Date.now();
        const newPostItem = { id: newId, ...payload };

        // Try API endpoint
        try {
          await axios.post('/api/v1/admin/posts', payload);
        } catch (apiErr) {
          console.warn('API endpoint unavailable for create, creating locally:', apiErr.message);
        }

        const updated = [newPostItem, ...posts];
        savePostsToStorage(updated);
        showToast(`Post "${payload.title}" created successfully!`, 'success');
      }

      setIsFormOpen(false);
    } catch (err) {
      console.error('Error submitting form:', err);
      showToast('An error occurred while saving the post.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!currentPost) return;
    setActionLoading(true);

    try {
      try {
        await axios.delete(`/api/v1/admin/posts/${currentPost.id}`);
      } catch (apiErr) {
        console.warn('API endpoint unavailable for delete, removing locally:', apiErr.message);
      }

      const updated = posts.filter(p => p.id !== currentPost.id);
      savePostsToStorage(updated);
      showToast(`Post "${currentPost.title}" deleted successfully!`, 'success');
      setIsDeleteOpen(false);
      setCurrentPost(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      showToast('Failed to delete the post.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter & Search Logic
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(post.id).includes(searchTerm);
    
    const matchesCategory = 
      selectedCategory === 'ALL' || 
      Number(post.categories_id) === Number(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Overall Stats
  const totalViews = posts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);

  return (
    <Layout>
      <Outer className="min-h-screen mt-16 md:mt-20 pb-12">
        <div className="hidden sm:block sm:col-span-1"></div>
        <div className="col-span-12 sm:col-span-10 px-3 md:px-6">
          
          {/* Toast Alert */}
          {toast && (
            <div 
              className={`fixed top-20 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-white transition-all transform duration-300 ${
                toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
              }`}
            >
              {toast.type === 'error' ? <FaExclamationTriangle fontSize={18} /> : <FaCheck fontSize={18} />}
              <span className="font-medium text-sm md:text-base">{toast.message}</span>
              <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
                <FaTimes />
              </button>
            </div>
          )}

          {/* Admin Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-red-500/10 text-red-500 p-2.5 rounded-lg">
                  <FaNewspaper fontSize={24} />
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage, view, add, update, and delete posts
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium shadow transition cursor-pointer text-sm"
              >
                <FaPlus /> Add New Post
              </button>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Total Posts
              </p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {posts.length}
              </h3>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Total Views
              </p>
              <h3 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {totalViews.toLocaleString()}
              </h3>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Categories
              </p>
              <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {CATEGORIES.length}
              </h3>
            </div>
          </div>

          {/* Toolbar & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts by title, description or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Category Filter & View Mode */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg">
                <FaFilter className="text-gray-400 text-xs" />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id} className="text-black bg-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggle Table/Grid */}
              <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2.5 text-sm ${
                    viewMode === 'table' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                  title="Table View"
                >
                  <FaTable />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 text-sm ${
                    viewMode === 'grid' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                  title="Grid View"
                >
                  <FaTh />
                </button>
              </div>
            </div>
          </div>

          {/* Posts List Content */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-red-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">Loading posts data...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center border border-gray-200 dark:border-zinc-800 my-6">
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">No posts found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                Try adjusting your search criteria or add a new post.
              </p>
              <button
                onClick={handleOpenAdd}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                + Create Post
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* TABLE VIEW */
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-zinc-800/80 border-b border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold uppercase text-xs">
                      <th className="py-3.5 px-4">Post</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Views</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                    {currentPosts.map((post) => (
                      <tr 
                        key={post.id} 
                        className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={post.portrait_image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800'}
                              alt={post.title}
                              className="w-12 h-12 rounded-lg object-cover bg-gray-200 dark:bg-zinc-800 shrink-0"
                              onError={(e) => {
                                e.target.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800';
                              }}
                            />
                            <div className="max-w-xs md:max-w-md">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate" title={post.title}>
                                {post.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                {post.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 rounded text-xs font-medium border border-zinc-200 dark:border-zinc-700">
                            {post.category_name || CATEGORIES.find(c => Number(c.id) === Number(post.categories_id))?.name || 'News'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 text-xs">
                          {post.date || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 text-xs">
                          <span className="flex items-center gap-1">
                            <FaEye className="text-gray-400" />
                            {post.views || 0}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenDetail(post)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(post)}
                              className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition"
                              title="Edit Post"
                            >
                              <FaPen />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(post)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                              title="Delete Post"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {currentPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                      <img
                        src={post.portrait_image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-semibold">
                        {post.category_name || CATEGORIES.find(c => Number(c.id) === Number(post.categories_id))?.name || 'News'}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 text-base">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-3 mb-4">
                        {post.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaEye /> {post.views || 0} views
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDetail(post)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="p-1.5 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded transition"
                        title="Edit"
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(post)}
                        className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="px-3 py-1.5 rounded border border-gray-300 dark:border-zinc-700 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-200"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded text-xs font-medium ${
                    currentPage === page
                      ? 'bg-red-600 text-white'
                      : 'border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className="px-3 py-1.5 rounded border border-gray-300 dark:border-zinc-700 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-200"
              >
                Next
              </button>
            </div>
          )}

        </div>
        <div className="hidden sm:block sm:col-span-1"></div>

        {/* CREATE / EDIT POST MODAL */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/60">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase">
                  {isEditing ? 'Update Post' : 'Add New Post'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                >
                  <FaTimes fontSize={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter post title"
                    className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 ${
                      formErrors.title 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-zinc-700 focus:ring-red-500'
                    }`}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                  )}
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.categories_id}
                      onChange={(e) => {
                        const catId = Number(e.target.value);
                        const catName = CATEGORIES.find(c => c.id === catId)?.name || 'News';
                        setFormData({ ...formData, categories_id: catId, category_name: catName });
                      }}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Portrait Image URL */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.portrait_image}
                    onChange={(e) => setFormData({ ...formData, portrait_image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 ${
                      formErrors.portrait_image 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-zinc-700 focus:ring-red-500'
                    }`}
                  />
                  {formErrors.portrait_image && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.portrait_image}</p>
                  )}
                  {formData.portrait_image && (
                    <div className="mt-2 h-28 w-44 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800">
                      <img
                        src={formData.portrait_image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Video URL & Views */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                      Video Link / URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                      Initial Views Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.views}
                      onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter post description..."
                    className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 ${
                      formErrors.description 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-zinc-700 focus:ring-red-500'
                    }`}
                  ></textarea>
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition cursor-pointer shadow disabled:opacity-50"
                  >
                    {actionLoading ? 'Saving...' : isEditing ? 'Update Post' : 'Save Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIEW POST DETAIL MODAL */}
        {isDetailOpen && currentPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/60">
                <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase truncate">
                  Post Preview #{currentPost.id}
                </h3>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                >
                  <FaTimes fontSize={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="h-56 w-full rounded-lg overflow-hidden bg-gray-200 dark:bg-zinc-800">
                  <img
                    src={currentPost.portrait_image}
                    alt={currentPost.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-200 dark:border-zinc-800 pb-3">
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 rounded font-medium">
                    Category: {currentPost.category_name || CATEGORIES.find(c => Number(c.id) === Number(currentPost.categories_id))?.name || 'News'}
                  </span>
                  <span>Date: {currentPost.date}</span>
                  <span className="flex items-center gap-1">
                    <FaEye /> {currentPost.views || 0} views
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentPost.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {currentPost.description}
                  </p>
                </div>

                {currentPost.video_url && (
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-lg text-xs text-gray-600 dark:text-gray-300">
                    <strong className="block text-gray-900 dark:text-white mb-1">Video Link:</strong>
                    <a 
                      href={currentPost.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-red-500 hover:underline break-all"
                    >
                      {currentPost.video_url}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 dark:bg-zinc-800/40 border-t border-gray-200 dark:border-zinc-800">
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    handleOpenEdit(currentPost);
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition cursor-pointer"
                >
                  Edit Post
                </button>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 text-xs font-medium transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {isDeleteOpen && currentPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-2xl text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle fontSize={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Delete Post?
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-800 dark:text-gray-200">"{currentPost.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition cursor-pointer shadow disabled:opacity-50"
                >
                  {actionLoading ? 'Deleting...' : 'Delete Post'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 col-span-12">
          <Footer />
        </div>
      </Outer>
    </Layout>
  );
};

export default Admin;
