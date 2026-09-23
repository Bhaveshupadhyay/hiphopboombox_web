import { useState, useEffect, useMemo } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch, 
  FaTimes, 
  FaSpinner, 
  FaCheck, 
  FaFolder, 
  FaChartBar, 
  FaArrowLeft 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Layout, Outer, Footer, Pagination } from '../../components';
import axios from '../../api/axios';

const STORAGE_KEY = 'admin_posts_data';

const DEFAULT_POSTS = [
  {
    id: 101,
    title: 'Top Hip-Hop Tracks of 2026',
    title_translate: 'Top Hip-Hop Tracks of 2026',
    des: 'A comprehensive roundup of the biggest hits and chart-topping hip-hop anthems of the year.',
    des_translate: 'A comprehensive roundup of the biggest hits and chart-topping hip-hop anthems of the year.',
    category_id: 1,
    category_name: 'Trending',
    portrait_image: 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: 1250,
    date: '2026-09-20'
  },
  {
    id: 102,
    title: 'Exclusive Interview with Underground Legends',
    title_translate: 'Exclusive Interview with Underground Legends',
    des: 'Behind the scenes discussion with rising hip-hop visionaries breaking new ground.',
    des_translate: 'Behind the scenes discussion with rising hip-hop visionaries breaking new ground.',
    category_id: 2,
    category_name: 'Interviews',
    portrait_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: 890,
    date: '2026-09-18'
  },
  {
    id: 103,
    title: 'New Album Review & Beat Breakdown',
    title_translate: 'New Album Review & Beat Breakdown',
    des: 'In-depth review examining sample choices, production techniques, and lyrical themes.',
    des_translate: 'In-depth review examining sample choices, production techniques, and lyrical themes.',
    category_id: 3,
    category_name: 'Reviews',
    portrait_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: 430,
    date: '2026-09-15'
  }
];

const INITIAL_FORM_STATE = {
  id: null,
  title: '',
  title_translate: '',
  des: '',
  des_translate: '',
  category_id: '1',
  portrait_image: '',
  url: '',
  views: 0,
  date: new Date().toISOString().split('T')[0]
};

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Trending' },
    { id: 2, name: 'Interviews' },
    { id: 3, name: 'Reviews' },
    { id: 4, name: 'Music Videos' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search & Filter & Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit' | 'view' | 'delete'
    targetPost: null
  });

  // Form State
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Fetch initial posts and categories
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchInitialData = async () => {
      setIsLoading(true);
      let loadedPosts = [];

      // 1. Try local storage first
      try {
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedPosts = parsed;
          }
        }
      } catch (err) {
        console.error('Failed to read from localStorage:', err);
      }

      // 2. Fetch from backend API if local storage empty or to supplement
      if (loadedPosts.length === 0) {
        try {
          const res = await axios.get('/api/v1/user_web/post_date/all?page=1&items=20', {
            signal: controller.signal
          });
          
          let apiPosts = [];
          if (Array.isArray(res?.data)) {
            apiPosts = res.data;
          } else if (res?.data && Array.isArray(res.data.data)) {
            apiPosts = res.data.data;
          }

          if (apiPosts.length > 0) {
            loadedPosts = apiPosts.map(p => ({
              id: p.id || Date.now(),
              title: p.title || 'Untitled Post',
              title_translate: p.title_translate || p.title || '',
              des: p.des || p.description || '',
              des_translate: p.des_translate || p.des || p.description || '',
              category_id: p.category_id || p.cat_id || 1,
              portrait_image: p.portrait_image || p.image || 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              url: p.url || p.video_url || '',
              views: p.views || 0,
              date: p.date || p.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
            }));
          }
        } catch (err) {
          if (err.name !== 'CanceledError') {
            console.log('Backend post fetch fallback to defaults');
          }
        }
      }

      // 3. Fallback to default posts if still empty
      if (loadedPosts.length === 0) {
        loadedPosts = DEFAULT_POSTS;
      }

      if (isMounted) {
        setPosts(loadedPosts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedPosts));
        setIsLoading(false);
      }

      // Fetch categories
      try {
        const catRes = await axios.get('/api/v1/user_web/category', { signal: controller.signal });
        let catData = [];
        if (Array.isArray(catRes?.data)) catData = catRes.data;
        else if (catRes?.data && Array.isArray(catRes.data.data)) catData = catRes.data.data;

        if (isMounted && catData.length > 0) {
          setCategories(catData.map(c => ({ id: c.id, name: c.name || c.title || `Category ${c.id}` })));
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.log('Category fetch fallback to defaults');
        }
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Save to localStorage when posts state updates
  const syncPosts = (updatedPosts) => {
    setPosts(updatedPosts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.des?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        String(post.category_id) === String(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  // Paginated posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPosts, currentPage, itemsPerPage]);

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.des.trim()) errors.des = 'Description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open Modals
  const handleOpenCreateModal = () => {
    setFormData({
      ...INITIAL_FORM_STATE,
      date: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
    setModalState({ isOpen: true, mode: 'create', targetPost: null });
  };

  const handleOpenEditModal = (post) => {
    setFormData({
      id: post.id,
      title: post.title || '',
      title_translate: post.title_translate || '',
      des: post.des || post.description || '',
      des_translate: post.des_translate || '',
      category_id: String(post.category_id || '1'),
      portrait_image: post.portrait_image || '',
      url: post.url || '',
      views: post.views || 0,
      date: post.date || new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
    setModalState({ isOpen: true, mode: 'edit', targetPost: post });
  };

  const handleOpenViewModal = (post) => {
    setModalState({ isOpen: true, mode: 'view', targetPost: post });
  };

  const handleOpenDeleteModal = (post) => {
    setModalState({ isOpen: true, mode: 'delete', targetPost: post });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: 'create', targetPost: null });
    setFormErrors({});
  };

  // Form Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // CREATE POST ACTION
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const newPostObj = {
      id: Date.now(),
      title: formData.title.trim(),
      title_translate: formData.title_translate.trim() || formData.title.trim(),
      des: formData.des.trim(),
      description: formData.des.trim(),
      des_translate: formData.des_translate.trim() || formData.des.trim(),
      category_id: Number(formData.category_id) || 1,
      portrait_image: formData.portrait_image.trim() || 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      url: formData.url.trim() || '',
      views: Number(formData.views) || 0,
      date: formData.date || new Date().toISOString().split('T')[0]
    };

    // Try backend API post
    try {
      await axios.post('/api/v1/admin/posts', newPostObj);
    } catch (err) {
      console.log('Backend create post endpoint note:', err.message);
    }

    const updated = [newPostObj, ...posts];
    syncPosts(updated);
    setIsSubmitting(false);
    handleCloseModal();
    showNotification('Post added successfully!', 'success');
  };

  // UPDATE POST ACTION
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const updatedPostObj = {
      id: formData.id,
      title: formData.title.trim(),
      title_translate: formData.title_translate.trim() || formData.title.trim(),
      des: formData.des.trim(),
      description: formData.des.trim(),
      des_translate: formData.des_translate.trim() || formData.des.trim(),
      category_id: Number(formData.category_id) || 1,
      portrait_image: formData.portrait_image.trim() || 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      url: formData.url.trim() || '',
      views: Number(formData.views) || 0,
      date: formData.date || new Date().toISOString().split('T')[0]
    };

    // Try backend API put
    try {
      await axios.put(`/api/v1/admin/posts/${formData.id}`, updatedPostObj);
    } catch (err) {
      console.log('Backend update post endpoint note:', err.message);
    }

    const updated = posts.map(p => (p.id === formData.id ? updatedPostObj : p));
    syncPosts(updated);
    setIsSubmitting(false);
    handleCloseModal();
    showNotification('Post updated successfully!', 'success');
  };

  // DELETE POST ACTION
  const handleDeletePost = async () => {
    if (!modalState.targetPost) return;
    const targetId = modalState.targetPost.id;
    setIsSubmitting(true);

    // Try backend API delete
    try {
      await axios.delete(`/api/v1/admin/posts/${targetId}`);
    } catch (err) {
      console.log('Backend delete post endpoint note:', err.message);
    }

    const updated = posts.filter(p => p.id !== targetId);
    syncPosts(updated);
    setIsSubmitting(false);
    handleCloseModal();
    showNotification('Post deleted successfully!', 'success');
  };

  const getCategoryName = (catId) => {
    const found = categories.find(c => String(c.id) === String(catId));
    return found ? found.name : `Cat #${catId}`;
  };

  return (
    <Layout>
      <Outer className="min-h-screen mt-16 md:mt-20 px-4 sm:px-8 pb-12">
        <div className="md:col-span-12 w-full max-w-7xl mx-auto">
          
          {/* Toast Notification */}
          {toast.show && (
            <div className={`fixed top-20 right-6 z-50 px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3 text-white transition-all transform duration-300 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
              <FaCheck className="text-xl" />
              <span className="font-semibold">{toast.message}</span>
            </div>
          )}

          {/* Top Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 rounded-xl p-6 md:p-8 text-white shadow-lg mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link to="/" className="text-gray-300 hover:text-white transition flex items-center space-x-1 text-sm">
                  <FaArrowLeft />
                  <span>Back to Site</span>
                </Link>
                <span className="text-gray-400">|</span>
                <span className="bg-blue-500/30 text-blue-200 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-blue-400/30">Admin Dashboard</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">Post Management Panel</h1>
              <p className="text-blue-100 mt-1 text-sm md:text-base">View, Add, Update, and Delete posts seamlessly across HipHopBoombox.</p>
            </div>
            
            <button
              onClick={handleOpenCreateModal}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <FaPlus />
              <span>Create New Post</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Total Posts</p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{posts.length}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                <FaChartBar className="text-2xl" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Categories</p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{categories.length}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-950 p-3 rounded-xl text-purple-600 dark:text-purple-400">
                <FaFolder className="text-2xl" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Total Views</p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                  {posts.reduce((acc, p) => acc + (Number(p.views) || 0), 0)}
                </p>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-950 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
                <FaEye className="text-2xl" />
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts by title or content..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <label className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">Filter by Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="w-full md:w-48 py-2.5 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Table View */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center p-12 space-y-3">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No posts found.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your search criteria or add a new post.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      <th className="py-4 px-4">Post</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Date</th>
                      <th className="py-4 px-4">Views</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                    {paginatedPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                        
                        {/* Thumbnail & Title */}
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={post.portrait_image || 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                              alt={post.title}
                              className="w-14 h-14 object-cover rounded-lg shrink-0 border border-gray-200 dark:border-gray-700"
                              onError={(e) => { e.target.src = 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'; }}
                            />
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{post.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{post.des}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                            {getCategoryName(post.category_id)}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 whitespace-nowrap text-gray-600 dark:text-gray-300 text-xs">
                          {post.date || 'N/A'}
                        </td>

                        {/* Views */}
                        <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300">
                          {post.views || 0}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 whitespace-nowrap text-right space-x-2">
                          {/* View */}
                          <button
                            onClick={() => handleOpenViewModal(post)}
                            title="View Post Details"
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 p-2 rounded-lg transition cursor-pointer"
                          >
                            <FaEye />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(post)}
                            title="Edit Post"
                            className="bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 p-2 rounded-lg transition cursor-pointer"
                          >
                            <FaEdit />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleOpenDeleteModal(post)}
                            title="Delete Post"
                            className="bg-red-100 hover:bg-red-200 dark:bg-red-950 dark:hover:bg-red-900 text-red-700 dark:text-red-300 p-2 rounded-lg transition cursor-pointer"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredPosts.length > itemsPerPage && (
            <div className="flex justify-center items-center my-6">
              <Pagination
                isLoading={isLoading}
                currentPage={currentPage}
                onClick={(p) => setCurrentPage(p)}
              />
            </div>
          )}

        </div>
      </Outer>

      {/* CREATE & EDIT MODAL */}
      {modalState.isOpen && (modalState.mode === 'create' || modalState.mode === 'edit') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transform transition-all my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalState.mode === 'create' ? 'Add New Post' : 'Edit Post'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition text-lg p-1"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={modalState.mode === 'create' ? handleCreatePost : handleUpdatePost} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title..."
                  className={`w-full p-2.5 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white ${formErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>

              {/* Title Translation (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Title Translation (Optional)
                </label>
                <input
                  type="text"
                  name="title_translate"
                  value={formData.title_translate}
                  onChange={handleInputChange}
                  placeholder="Enter translated title..."
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="des"
                  rows={3}
                  value={formData.des}
                  onChange={handleInputChange}
                  placeholder="Enter post description..."
                  className={`w-full p-2.5 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white ${formErrors.des ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                />
                {formErrors.des && <p className="text-red-500 text-xs mt-1">{formErrors.des}</p>}
              </div>

              {/* Description Translation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description Translation (Optional)
                </label>
                <textarea
                  name="des_translate"
                  rows={2}
                  value={formData.des_translate}
                  onChange={handleInputChange}
                  placeholder="Enter translated description..."
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              {/* Image URL & Media URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Image / Thumbnail URL
                  </label>
                  <input
                    type="url"
                    name="portrait_image"
                    value={formData.portrait_image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Media / Video URL
                  </label>
                  <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
              </div>

              {/* Views */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Initial Views Count
                </label>
                <input
                  type="number"
                  name="views"
                  min="0"
                  value={formData.views}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              {/* Form Footer Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg text-sm transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{modalState.mode === 'create' ? 'Create Post' : 'Save Changes'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {modalState.isOpen && modalState.mode === 'view' && modalState.targetPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-xl w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="relative h-64 bg-gray-900">
              <img
                src={modalState.targetPost.portrait_image || 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                alt={modalState.targetPost.title}
                className="w-full h-full object-cover opacity-90"
              />
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {getCategoryName(modalState.targetPost.category_id)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Views: <strong className="text-gray-700 dark:text-gray-200">{modalState.targetPost.views || 0}</strong> | Date: <strong className="text-gray-700 dark:text-gray-200">{modalState.targetPost.date}</strong>
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{modalState.targetPost.title}</h2>
              {modalState.targetPost.title_translate && (
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 italic">Translated: {modalState.targetPost.title_translate}</p>
              )}

              <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{modalState.targetPost.des}</p>
              </div>

              {modalState.targetPost.url && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Media URL:</p>
                  <a
                    href={modalState.targetPost.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {modalState.targetPost.url}
                  </a>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {modalState.isOpen && modalState.mode === 'delete' && modalState.targetPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800 p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl">
              <FaTrash />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Post</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete post <strong className="text-gray-900 dark:text-white">"{modalState.targetPost.title}"</strong>? This action cannot be undone.
            </p>

            <div className="pt-4 flex justify-center space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg text-sm transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </Layout>
  );
};

export default Admin;
