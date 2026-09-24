import { useState, useEffect, useMemo } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch, 
  FaTimes, 
  FaCheck, 
  FaFolder, 
  FaChartBar,
  FaFileAlt,
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';
import { Layout, Outer, Footer, DateFormat } from '../../components';
import axios from '../../api/axios';

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Hip Hop News' },
  { id: 2, name: 'Music' },
  { id: 3, name: 'Video' },
  { id: 4, name: 'Trending' },
  { id: 5, name: 'Raffle' }
];

const INITIAL_SAMPLE_POSTS = [
  {
    id: 101,
    title: 'New Album Release Announced by Top Hip Hop Artist',
    description: 'Exclusive announcement regarding the upcoming summer album dropping next month featuring top collaborations.',
    categories_id: 1,
    category_name: 'Hip Hop News',
    portrait_image: 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: 1250,
    created_at: new Date().toISOString()
  },
  {
    id: 102,
    title: 'Top 10 Underground Beatmakers of the Year',
    description: 'A deep dive into producers defining the new sound of urban boombox rhythm.',
    categories_id: 2,
    category_name: 'Music',
    portrait_image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video_url: '',
    views: 890,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 103,
    title: 'Exclusive Music Video Premiere: Boombox Chronicles',
    description: 'Check out the official music video with behind the scenes footage from the studio.',
    categories_id: 3,
    category_name: 'Video',
    portrait_image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: 2400,
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

const Admin = () => {
  // Post states
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form State
  const [editingPost, setEditingPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories_id: '1',
    category_name: 'Hip Hop News',
    portrait_image: '',
    video_url: '',
    views: 0
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load posts on mount
  useEffect(() => {
    const fetchPostsData = async () => {
      setIsLoading(true);
      try {
        // Attempt to load from API
        const res = await axios.get('/api/v1/user_web/posts/?page=1');
        let apiPosts = [];

        if (res.data && res.data.isSuccess && res.data.data) {
          const rawData = res.data.data;
          if (Array.isArray(rawData)) {
            apiPosts = rawData;
          } else if (typeof rawData === 'object') {
            apiPosts = [
              ...(rawData.today || []),
              ...(rawData.yesterday || []),
              ...(rawData.day_before_yesterday || [])
            ];
          }
        }

        // Load custom local storage posts
        const storedCustom = localStorage.getItem('admin_posts_custom');
        const customPosts = storedCustom ? JSON.parse(storedCustom) : [];

        if (apiPosts.length > 0 || customPosts.length > 0) {
          const combined = [...customPosts, ...apiPosts];
          // Remove duplicates by id
          const uniquePosts = Array.from(new Map(combined.map(item => [item.id, item])).values());
          setPosts(uniquePosts);
        } else {
          // Fallback to initial sample posts if no data from API
          setPosts(INITIAL_SAMPLE_POSTS);
        }
      } catch (err) {
        console.warn('Backend API fetch error, using local/sample posts fallback:', err.message);
        const storedCustom = localStorage.getItem('admin_posts_custom');
        if (storedCustom) {
          setPosts(JSON.parse(storedCustom));
        } else {
          setPosts(INITIAL_SAMPLE_POSTS);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostsData();
  }, []);

  // Save custom post changes to localStorage helper
  const syncLocalStorage = (updatedPosts) => {
    try {
      localStorage.setItem('admin_posts_custom', JSON.stringify(updatedPosts));
    } catch (e) {
      console.error('Failed to sync to localStorage:', e);
    }
  };

  // Filtered posts computation
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = 
        !searchTerm.trim() ||
        (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat = 
        selectedCategory === 'all' || 
        String(post.categories_id) === String(selectedCategory) ||
        (post.category_name && post.category_name.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [posts, searchTerm, selectedCategory]);

  // Paginated posts
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage) || 1;
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPosts, currentPage, itemsPerPage]);

  // Handle Form Open for Create
  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      description: '',
      categories_id: '1',
      category_name: 'Hip Hop News',
      portrait_image: 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      video_url: '',
      views: 0
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Handle Form Open for Edit
  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      description: post.description || '',
      categories_id: String(post.categories_id || '1'),
      category_name: post.category_name || 'Hip Hop News',
      portrait_image: post.portrait_image || post.image_url || '',
      video_url: post.video_url || post.url || '',
      views: post.views || 0
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Handle View Open
  const handleOpenViewModal = (post) => {
    setViewingPost(post);
    setIsViewModalOpen(true);
  };

  // Handle Delete Open
  const handleOpenDeleteModal = (post) => {
    setDeletingPost(post);
    setIsDeleteModalOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.portrait_image.trim()) {
      errors.portrait_image = 'Image URL is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Category Select Change in Form
  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const foundCat = INITIAL_CATEGORIES.find(c => String(c.id) === String(catId));
    setFormData(prev => ({
      ...prev,
      categories_id: catId,
      category_name: foundCat ? foundCat.name : 'General'
    }));
  };

  // Handle Create or Update Submit
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (editingPost) {
        // UPDATE POST
        const updatedPostObj = {
          ...editingPost,
          title: formData.title.trim(),
          description: formData.description.trim(),
          categories_id: parseInt(formData.categories_id),
          category_name: formData.category_name,
          portrait_image: formData.portrait_image.trim(),
          video_url: formData.video_url.trim(),
          views: Number(formData.views) || 0,
          updated_at: new Date().toISOString()
        };

        // Try API endpoint
        try {
          await axios.put(`/api/v1/user_web/posts/${editingPost.id}`, updatedPostObj);
        } catch (apiErr) {
          console.warn('API update failed, updating locally:', apiErr.message);
        }

        const newPosts = posts.map(p => p.id === editingPost.id ? updatedPostObj : p);
        setPosts(newPosts);
        syncLocalStorage(newPosts);
        showToast('Post updated successfully!', 'success');
      } else {
        // CREATE POST
        const newPostObj = {
          id: Date.now(),
          title: formData.title.trim(),
          description: formData.description.trim(),
          categories_id: parseInt(formData.categories_id),
          category_name: formData.category_name,
          portrait_image: formData.portrait_image.trim(),
          video_url: formData.video_url.trim(),
          views: Number(formData.views) || 0,
          created_at: new Date().toISOString()
        };

        // Try API endpoint
        try {
          await axios.post('/api/v1/user_web/posts', newPostObj);
        } catch (apiErr) {
          console.warn('API creation failed, adding locally:', apiErr.message);
        }

        const newPosts = [newPostObj, ...posts];
        setPosts(newPosts);
        syncLocalStorage(newPosts);
        showToast('New post created successfully!', 'success');
      }

      setIsFormModalOpen(false);
    } catch (err) {
      showToast('An error occurred while saving post: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirm
  const handleConfirmDelete = async () => {
    if (!deletingPost) return;

    setIsSubmitting(true);
    try {
      // Try API endpoint
      try {
        await axios.delete(`/api/v1/user_web/posts/${deletingPost.id}`);
      } catch (apiErr) {
        console.warn('API delete failed, removing locally:', apiErr.message);
      }

      const updated = posts.filter(p => p.id !== deletingPost.id);
      setPosts(updated);
      syncLocalStorage(updated);
      showToast(`Post #${deletingPost.id} deleted successfully!`, 'success');
      setIsDeleteModalOpen(false);
      setDeletingPost(null);
    } catch (err) {
      showToast('Failed to delete post: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Total Statistics
  const totalViews = useMemo(() => {
    return posts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
  }, [posts]);

  return (
    <Layout>
      <Outer className="min-h-screen mt-16 md:mt-20 px-2 sm:px-4 pb-12">
        <div className="hidden md:block md:col-span-1"></div>
        <div className="col-span-1 md:col-span-10 flex flex-col gap-6">

          {/* Toast Notification */}
          {toast && (
            <div className={`fixed top-20 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-white transition-all transform translate-y-0 ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {toast.type === 'success' ? <FaCheck fontSize={18} /> : <FaExclamationTriangle fontSize={18} />}
              <span className="font-medium text-sm md:text-base">{toast.message}</span>
              <button onClick={() => setToast(null)} className="ml-4 hover:opacity-80">
                <FaTimes />
              </button>
            </div>
          )}

          {/* Admin Header & Stats */}
          <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-5 md:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                  <FaFileAlt className="text-blue-500" /> Admin Panel - Posts Management
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Manage all website posts: view details, add new content, update, or remove existing posts.
                </p>
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <FaPlus /> Add New Post
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-semibold text-blue-600 dark:text-blue-400 tracking-wider">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{posts.length}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-600 dark:text-blue-400">
                  <FaFileAlt fontSize={22} />
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-semibold text-purple-600 dark:text-purple-400 tracking-wider">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{INITIAL_CATEGORIES.length}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-full text-purple-600 dark:text-purple-400">
                  <FaFolder fontSize={22} />
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-semibold text-amber-600 dark:text-amber-400 tracking-wider">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalViews.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-full text-amber-600 dark:text-amber-400">
                  <FaChartBar fontSize={22} />
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts by title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 whitespace-nowrap">Filter Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-48 px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {INITIAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Table View */}
          <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-3 text-sm">Loading posts data...</p>
              </div>
            ) : paginatedPosts.length === 0 ? (
              <div className="p-12 text-center">
                <FaFileAlt className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No posts found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search filter or add a new post.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-black/60 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider border-b border-gray-200 dark:border-gray-800">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Thumbnail</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Views</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                    {paginatedPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-gray-500 dark:text-gray-400">#{post.id}</td>
                        <td className="py-3 px-4">
                          <img
                            src={post.portrait_image || post.image_url || 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                            alt={post.title}
                            className="w-12 h-12 rounded object-cover border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                            onError={(e) => {
                              e.target.src = 'https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                            }}
                          />
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-semibold text-gray-900 dark:text-white truncate" title={post.title}>
                            {post.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5" title={post.description}>
                            {post.description}
                          </p>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                            {post.category_name || `Category ${post.categories_id}`}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-gray-700 dark:text-gray-300 font-mono text-xs">
                          {(post.views || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                          {post.created_at ? <DateFormat homeDate={post.created_at} path="posts" /> : 'Recent'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenViewModal(post)}
                              title="View Details"
                              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                            >
                              <FaEye fontSize={16} />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(post)}
                              title="Edit Post"
                              className="p-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors cursor-pointer"
                            >
                              <FaEdit fontSize={16} />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(post)}
                              title="Delete Post"
                              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
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
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-4 py-3 bg-gray-50 dark:bg-black/40 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Showing Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    <FaArrowLeft fontSize={12} />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    <FaArrowRight fontSize={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="hidden md:block md:col-span-1"></div>

        {/* MODAL 1: CREATE / EDIT FORM */}
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white dark:bg-[#1c1c1c] px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {editingPost ? <FaEdit className="text-amber-500" /> : <FaPlus className="text-blue-500" />}
                  {editingPost ? 'Update Post' : 'Add New Post'}
                </h3>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <FaTimes fontSize={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-1">
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter post title..."
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-black border ${
                      formErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                </div>

                {/* Category & Views */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.categories_id}
                      onChange={handleCategoryChange}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {INITIAL_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-1">
                      Initial Views
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.views}
                      onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-1">
                    Image / Thumbnail URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.portrait_image}
                    onChange={(e) => setFormData({ ...formData, portrait_image: e.target.value })}
                    placeholder="https://images.pexels.com/..."
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-black border ${
                      formErrors.portrait_image ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.portrait_image && <p className="text-red-500 text-xs mt-1">{formErrors.portrait_image}</p>}

                  {/* Image Preview Box */}
                  {formData.portrait_image && (
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-black/40 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center gap-3">
                      <img
                        src={formData.portrait_image}
                        alt="Preview"
                        className="w-16 h-12 object-cover rounded border border-gray-300 dark:border-gray-700"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{formData.portrait_image}</span>
                    </div>
                  )}
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-1">
                    Video URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter post description..."
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-black border ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  ></textarea>
                  {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : editingPost ? 'Update Post' : 'Save Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: VIEW DETAILS */}
        {isViewModalOpen && viewingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
              <div className="relative">
                <img
                  src={viewingPost.portrait_image || viewingPost.image_url}
                  alt={viewingPost.title}
                  className="w-full h-56 object-cover"
                />
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors cursor-pointer"
                >
                  <FaTimes fontSize={16} />
                </button>
                <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {viewingPost.category_name || `Category ${viewingPost.categories_id}`}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {viewingPost.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {viewingPost.description}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Views:</span> {(viewingPost.views || 0).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">ID:</span> #{viewingPost.id}
                  </div>
                </div>

                {viewingPost.video_url && (
                  <div className="pt-2">
                    <a
                      href={viewingPost.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 underline hover:text-blue-600 truncate block"
                    >
                      Watch Video Link: {viewingPost.video_url}
                    </a>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: DELETE CONFIRMATION */}
        {isDeleteModalOpen && deletingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-center">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-950/50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle fontSize={26} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Delete Post?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{deletingPost.title}"</span>? This action cannot be undone.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Deleting...' : 'Yes, Delete Post'}
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </Outer>
    </Layout>
  );
};

export default Admin;
