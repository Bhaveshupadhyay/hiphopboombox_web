import { useState, useEffect, useCallback } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch, 
  FaSync, 
  FaTimes, 
  FaCheck, 
  FaSpinner, 
  FaThList, 
  FaThLarge,
  FaShieldAlt
} from 'react-icons/fa';
import { Layout, Outer, Pagination } from '../../components';
import axios, { axiosPrivate } from '../../api/axios';

const INITIAL_FORM_STATE = {
  title: '',
  title_translate: '',
  description: '',
  des_translate: '',
  category_id: '',
  portrait_image: '',
  video_url: '',
  social_media: '',
  views: 0,
  is_trending: false,
  is_featured: false
};

const Admin = () => {
  // Auth state
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token') || localStorage.getItem('adminToken') || '');
  const [tokenInput, setTokenInput] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Posts and categories state
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'add', 'edit', 'delete', 'view'
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});

  // Show Toast notification
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper for auth headers
  const getAuthHeaders = () => {
    const token = authToken || localStorage.getItem('token') || localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const endpoints = [
        '/api/v1/user_web/category',
        '/api/v1/admin/category',
        '/api/v1/category'
      ];
      
      for (const endpoint of endpoints) {
        try {
          const res = await axios.get(endpoint, { headers });
          const data = res.data?.data || (Array.isArray(res.data) ? res.data : []);
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
            break;
          }
        } catch {
          // try next endpoint
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Fetch Posts with multi-endpoint fallback
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setActionError('');
    
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const endpoints = [
      `/api/v1/admin/post?page=${page}&items=${itemsPerPage}`,
      `/api/v1/admin/posts?page=${page}&items=${itemsPerPage}`,
      `/api/v1/user_web/post_date/all?page=${page}&items=${itemsPerPage}`,
      `/api/v1/user_web/category_post/1?page=${page}&items=${itemsPerPage}`,
      `/api/v1/posts?page=${page}&items=${itemsPerPage}`
    ];

    let fetched = false;

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(endpoint, { headers });
        const resData = response.data;
        
        let list = [];
        let count = 0;

        if (Array.isArray(resData)) {
          list = resData;
          count = resData.length;
        } else if (resData && typeof resData === 'object') {
          list = Array.isArray(resData.data) ? resData.data : (Array.isArray(resData.posts) ? resData.posts : []);
          count = typeof resData.totalCount === 'number' ? resData.totalCount : (resData.count || list.length);
        }

        setPosts(list);
        setTotalCount(count);
        fetched = true;
        break;
      } catch {
        // try next fallback
      }
    }

    if (!fetched) {
      setActionError('Could not load posts. Please check your network or API endpoint connection.');
    }
    setIsLoading(false);
  }, [page, itemsPerPage]);

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [fetchCategories, fetchPosts]);

  // Handle Token Save
  const handleSaveToken = (e) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      localStorage.setItem('adminToken', tokenInput.trim());
      localStorage.setItem('token', tokenInput.trim());
      setAuthToken(tokenInput.trim());
      setShowAuthModal(false);
      showToast('Authentication token updated!', 'success');
      fetchPosts();
    }
  };

  // Open Modal Helpers
  const handleOpenAdd = () => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors({});
    setSelectedPost(null);
    setActiveModal('add');
  };

  const handleOpenEdit = (post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title || post.name || '',
      title_translate: post.title_translate || '',
      description: post.des || post.description || '',
      des_translate: post.des_translate || '',
      category_id: post.category_id || post.category?.id || (categories[0]?.id || ''),
      portrait_image: post.portrait_image || post.image || '',
      video_url: post.video_url || post.url || '',
      social_media: post.social_media || '',
      views: post.views || 0,
      is_trending: Boolean(post.is_trending || post.trending),
      is_featured: Boolean(post.is_featured || post.featured)
    });
    setFormErrors({});
    setActiveModal('edit');
  };

  const handleOpenDelete = (post) => {
    setSelectedPost(post);
    setActiveModal('delete');
  };

  const handleOpenView = (post) => {
    setSelectedPost(post);
    setActiveModal('view');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedPost(null);
    setFormErrors({});
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Post title is required';
    if (!formData.description.trim()) errors.description = 'Post description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CREATE POST API
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setActionError('');

    const payload = {
      title: formData.title.trim(),
      title_translate: formData.title_translate.trim(),
      description: formData.description.trim(),
      des: formData.description.trim(),
      des_translate: formData.des_translate.trim(),
      category_id: formData.category_id ? parseInt(formData.category_id, 10) : undefined,
      portrait_image: formData.portrait_image.trim(),
      video_url: formData.video_url.trim(),
      url: formData.video_url.trim(),
      social_media: formData.social_media.trim(),
      views: Number(formData.views) || 0,
      is_trending: formData.is_trending,
      is_featured: formData.is_featured
    };

    const endpoints = [
      '/api/v1/admin/post',
      '/api/v1/admin/posts',
      '/api/v1/post',
      '/api/v1/posts',
      '/api/v1/user_web/post'
    ];

    let success = false;
    let errRes = null;

    for (const endpoint of endpoints) {
      try {
        const response = await axiosPrivate.post(endpoint, payload, {
          headers: getAuthHeaders()
        });
        if (response.status === 200 || response.status === 201 || response.data?.isSuccess) {
          success = true;
          break;
        }
      } catch (err) {
        errRes = err;
      }
    }

    setIsSubmitting(false);

    if (success) {
      showToast('Post created successfully!', 'success');
      handleCloseModal();
      fetchPosts();
    } else {
      const msg = errRes?.response?.data?.message || errRes?.message || 'Failed to create post. Please check backend API.';
      setActionError(msg);
      showToast(msg, 'error');
    }
  };

  // UPDATE POST API
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!validateForm() || !selectedPost) return;

    setIsSubmitting(true);
    setActionError('');

    const postId = selectedPost.id;
    const payload = {
      id: postId,
      title: formData.title.trim(),
      title_translate: formData.title_translate.trim(),
      description: formData.description.trim(),
      des: formData.description.trim(),
      des_translate: formData.des_translate.trim(),
      category_id: formData.category_id ? parseInt(formData.category_id, 10) : undefined,
      portrait_image: formData.portrait_image.trim(),
      video_url: formData.video_url.trim(),
      url: formData.video_url.trim(),
      social_media: formData.social_media.trim(),
      views: Number(formData.views) || 0,
      is_trending: formData.is_trending,
      is_featured: formData.is_featured
    };

    const editMethods = [
      { method: 'put', url: `/api/v1/admin/post/${postId}` },
      { method: 'put', url: `/api/v1/admin/posts/${postId}` },
      { method: 'patch', url: `/api/v1/admin/post/${postId}` },
      { method: 'put', url: `/api/v1/post/${postId}` },
      { method: 'put', url: `/api/v1/posts/${postId}` },
      { method: 'put', url: `/api/v1/user_web/post/${postId}` }
    ];

    let success = false;
    let errRes = null;

    for (const target of editMethods) {
      try {
        const response = await axiosPrivate[target.method](target.url, payload, {
          headers: getAuthHeaders()
        });
        if (response.status === 200 || response.data?.isSuccess) {
          success = true;
          break;
        }
      } catch (err) {
        errRes = err;
      }
    }

    setIsSubmitting(false);

    if (success) {
      showToast(`Post #${postId} updated successfully!`, 'success');
      handleCloseModal();
      fetchPosts();
    } else {
      const msg = errRes?.response?.data?.message || errRes?.message || 'Failed to update post.';
      setActionError(msg);
      showToast(msg, 'error');
    }
  };

  // DELETE POST API
  const handleDeletePost = async () => {
    if (!selectedPost) return;

    setIsSubmitting(true);
    setActionError('');

    const postId = selectedPost.id;
    const deleteUrls = [
      `/api/v1/admin/post/${postId}`,
      `/api/v1/admin/posts/${postId}`,
      `/api/v1/post/${postId}`,
      `/api/v1/posts/${postId}`,
      `/api/v1/user_web/post/${postId}`
    ];

    let success = false;
    let errRes = null;

    for (const url of deleteUrls) {
      try {
        const response = await axiosPrivate.delete(url, {
          headers: getAuthHeaders()
        });
        if (response.status === 200 || response.status === 204 || response.data?.isSuccess) {
          success = true;
          break;
        }
      } catch (err) {
        errRes = err;
      }
    }

    setIsSubmitting(false);

    if (success) {
      showToast(`Post #${postId} deleted successfully!`, 'success');
      handleCloseModal();
      fetchPosts();
    } else {
      const msg = errRes?.response?.data?.message || errRes?.message || 'Failed to delete post.';
      setActionError(msg);
      showToast(msg, 'error');
    }
  };

  // Filtered posts client side search/category fallback
  const filteredPosts = posts.filter(post => {
    const postTitle = (post.title || post.name || '').toLowerCase();
    const postDes = (post.description || post.des || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = !query || postTitle.includes(query) || postDes.includes(query) || String(post.id).includes(query);
    const matchesCategory = selectedCategory === 'all' || 
      String(post.category_id) === String(selectedCategory) || 
      String(post.category?.id) === String(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <Outer className="min-h-screen mt-16 md:mt-20 px-2 sm:px-6 py-6">
        
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className={`fixed top-20 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-white flex items-center gap-3 transition-all transform translate-y-0 ${
            toastMessage.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}>
            {toastMessage.type === 'error' ? <FaTimes fontSize={18} /> : <FaCheck fontSize={18} />}
            <span className="font-medium text-sm sm:text-base">{toastMessage.message}</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Bar */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                <FaShieldAlt className="text-blue-500" /> Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage HipHop Boombox Posts — View, Add, Update, or Delete content.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 text-xs sm:text-sm font-medium border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                {authToken ? 'Token Configured' : 'Set Admin Token'}
              </button>

              <button
                onClick={fetchPosts}
                disabled={isLoading}
                className="p-2.5 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                title="Refresh List"
              >
                <FaSync className={isLoading ? 'animate-spin' : ''} />
              </button>

              <button
                onClick={handleOpenAdd}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow flex items-center gap-2 transition"
              >
                <FaPlus /> Add New Post
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
              <p className="text-xs uppercase font-semibold text-gray-400">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalCount || posts.length}</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
              <p className="text-xs uppercase font-semibold text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{categories.length}</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
              <p className="text-xs uppercase font-semibold text-gray-400">Trending Posts</p>
              <p className="text-2xl font-bold text-amber-500 mt-1">
                {posts.filter(p => p.is_trending || p.trending).length}
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
              <p className="text-xs uppercase font-semibold text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-emerald-500 mt-1">
                {posts.reduce((acc, p) => acc + (Number(p.views) || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Filters & View Toggle */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts by title, ID, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter & Layout Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-3 pr-8 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">All Categories ({categories.length})</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name || cat.title || `Category #${cat.id}`}</option>
                  ))}
                </select>
              </div>

              <div className="flex border border-gray-300 dark:border-zinc-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300'}`}
                  title="Table View"
                >
                  <FaThList />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300'}`}
                  title="Grid View"
                >
                  <FaThLarge />
                </button>
              </div>
            </div>
          </div>

          {/* Action Error Banner */}
          {actionError && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl text-sm flex items-center justify-between">
              <span>{actionError}</span>
              <button onClick={() => setActionError('')} className="text-red-500 hover:text-red-700"><FaTimes /></button>
            </div>
          )}

          {/* Post Content Display */}
          {isLoading ? (
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-12 text-center">
              <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-12 text-center">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No posts found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search query or category filter.</p>
              <button
                onClick={handleOpenAdd}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                Create New Post
              </button>
            </div>
          ) : viewMode === 'table' ? (
            
            /* Table View */
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200">
                <thead className="bg-gray-50 dark:bg-zinc-800/80 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-zinc-800">
                  <tr>
                    <th className="py-3.5 px-4">Post</th>
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Views</th>
                    <th className="py-3.5 px-4">Badges</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.portrait_image || post.image || 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg'}
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded-lg bg-gray-200 dark:bg-zinc-800 shrink-0"
                            onError={(e) => { e.target.src = 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg'; }}
                          />
                          <div className="max-w-md">
                            <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                              {post.title || post.name || `Post #${post.id}`}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                              {post.description || post.des || 'No description provided.'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-gray-500">#{post.id}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-zinc-700">
                          {categories.find(c => String(c.id) === String(post.category_id || post.category?.id))?.name || `Cat #${post.category_id || 'N/A'}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {(Number(post.views) || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {(post.is_trending || post.trending) && (
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] uppercase font-bold rounded">
                              Trending
                            </span>
                          )}
                          {(post.is_featured || post.featured) && (
                            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] uppercase font-bold rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenView(post)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded transition"
                            title="View Post Details"
                          >
                            <FaEye fontSize={16} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(post)}
                            className="p-1.5 text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 rounded transition"
                            title="Edit Post"
                          >
                            <FaEdit fontSize={16} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(post)}
                            className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded transition"
                            title="Delete Post"
                          >
                            <FaTrash fontSize={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (

            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="h-40 bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
                      <img
                        src={post.portrait_image || post.image || 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg'; }}
                      />
                      <span className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-mono rounded">
                        #{post.id}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                        {post.title || post.name || `Post #${post.id}`}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {post.description || post.des || 'No description available'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-gray-100 dark:border-zinc-800/80 mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Views: {Number(post.views) || 0}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleOpenView(post)} className="p-1 text-gray-500 hover:text-blue-500"><FaEye /></button>
                      <button onClick={() => handleOpenEdit(post)} className="p-1 text-gray-500 hover:text-amber-500"><FaEdit /></button>
                      <button onClick={() => handleOpenDelete(post)} className="p-1 text-gray-500 hover:text-red-500"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalCount > itemsPerPage && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={page}
                onClick={(p) => setPage(p)}
                isLoading={isLoading}
              />
            </div>
          )}

        </div>

        {/* --- ADD / EDIT POST MODAL --- */}
        {(activeModal === 'add' || activeModal === 'edit') && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-gray-900 dark:text-white">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-zinc-800">
                <h2 className="text-xl font-bold">
                  {activeModal === 'add' ? 'Add New Post' : `Edit Post #${selectedPost?.id}`}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                  <FaTimes fontSize={20} />
                </button>
              </div>

              <form onSubmit={activeModal === 'add' ? handleCreatePost : handleUpdatePost} className="mt-4 space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter main post title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                    }`}
                  />
                  {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                </div>

                {/* Title Translation */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Title Translation (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter translated title"
                    value={formData.title_translate}
                    onChange={(e) => setFormData({ ...formData, title_translate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category & Views */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name || c.title || `Category #${c.id}`}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                      Initial Views Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.views}
                      onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Portrait Image URL */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Image URL (portrait_image)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.example.com/photo.jpg"
                      value={formData.portrait_image}
                      onChange={(e) => setFormData({ ...formData, portrait_image: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {formData.portrait_image && (
                    <div className="mt-2 h-24 w-36 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-700 bg-black">
                      <img src={formData.portrait_image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Video URL & Social Media */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                      Video / Audio URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                      Social Media Link
                    </label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={formData.social_media}
                      onChange={(e) => setFormData({ ...formData, social_media: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Post Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter detailed post content or description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                    }`}
                  />
                  {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                </div>

                {/* Description Translation */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Description Translation (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter translated description"
                    value={formData.des_translate}
                    onChange={(e) => setFormData({ ...formData, des_translate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Checkbox Badges */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={formData.is_trending}
                      onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span>Mark as Trending</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span>Mark as Featured</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {isSubmitting && <FaSpinner className="animate-spin" />}
                    {activeModal === 'add' ? 'Create Post' : 'Save Changes'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* --- DELETE CONFIRMATION MODAL --- */}
        {activeModal === 'delete' && selectedPost && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 text-gray-900 dark:text-white shadow-2xl">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 text-xl">
                  <FaTrash />
                </div>
                <h3 className="text-lg font-bold">Delete Post #{selectedPost.id}?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{selectedPost.title || selectedPost.name}"</span>? This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" />}
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW DETAILS MODAL --- */}
        {activeModal === 'view' && selectedPost && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-gray-900 dark:text-white space-y-4">
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-zinc-800">
                <div>
                  <span className="text-xs font-mono text-gray-400">Post ID #{selectedPost.id}</span>
                  <h2 className="text-xl font-bold">{selectedPost.title || selectedPost.name}</h2>
                </div>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-white"><FaTimes fontSize={20} /></button>
              </div>

              {(selectedPost.portrait_image || selectedPost.image) && (
                <div className="h-64 rounded-xl overflow-hidden bg-black border border-gray-200 dark:border-zinc-800">
                  <img
                    src={selectedPost.portrait_image || selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-gray-50 dark:bg-zinc-800/60 p-3 rounded-lg border border-gray-200 dark:border-zinc-800">
                <div>
                  <span className="text-gray-400 block">Category ID</span>
                  <span className="font-semibold">{selectedPost.category_id || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Views</span>
                  <span className="font-semibold">{Number(selectedPost.views) || 0}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Flags</span>
                  <span className="font-semibold">
                    {selectedPost.is_trending ? 'Trending ' : ''}
                    {selectedPost.is_featured ? 'Featured' : ''}
                    {!selectedPost.is_trending && !selectedPost.is_featured ? 'Standard' : ''}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-400 mb-1">Description</h4>
                <p className="text-sm whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800 p-3.5 rounded-lg border border-gray-200 dark:border-zinc-800">
                  {selectedPost.description || selectedPost.des || 'No description details provided.'}
                </p>
              </div>

              {(selectedPost.video_url || selectedPost.url) && (
                <div>
                  <h4 className="text-xs uppercase font-semibold text-gray-400 mb-1">Video / Media URL</h4>
                  <a
                    href={selectedPost.video_url || selectedPost.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-500 hover:underline break-all"
                  >
                    {selectedPost.video_url || selectedPost.url}
                  </a>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-gray-200 dark:border-zinc-800 gap-2">
                <button
                  onClick={() => handleOpenEdit(selectedPost)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-lg flex items-center gap-2"
                >
                  <FaEdit /> Edit Post
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-700 text-sm font-medium rounded-lg"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

        {/* --- AUTH TOKEN SETTINGS MODAL --- */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 text-gray-900 dark:text-white shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-zinc-800">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FaShieldAlt className="text-blue-500" /> Admin Authorization Token
                </h3>
                <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Provide an admin JWT/Bearer token if your backend API requires token authorization for CRUD actions.
              </p>

              <form onSubmit={handleSaveToken} className="mt-4 space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Paste Bearer Token or Admin JWT key"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  >
                    Save Token
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </Outer>
    </Layout>
  );
};

export default Admin;
