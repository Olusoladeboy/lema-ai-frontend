import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts, useCreatePost, useDeletePost } from '../hooks/usePosts';
import { useUser } from '../hooks/useUser';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CloseIcon from '../assets/icons/CloseIcon';
import type { CreatePostRequest } from '../types';

const UserPosts = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '' });

  const { data: posts, isLoading: postsLoading, isError: postsError, error: postsErrorMsg } = usePosts(userId || '');
  const { data: user, isLoading: userLoading } = useUser(userId);
  const createPostMutation = useCreatePost();
  const deletePostMutation = useDeletePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !formData.title.trim() || !formData.body.trim()) {
      return;
    }

    const newPost: CreatePostRequest = {
      title: formData.title.trim(),
      body: formData.body.trim(),
      userId,
    };

    try {
      await createPostMutation.mutateAsync(newPost);
      setFormData({ title: '', body: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePostMutation.mutateAsync(postId);
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  if (postsLoading || userLoading) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-red-600">
          Error loading posts: {postsErrorMsg instanceof Error ? postsErrorMsg.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Users
          </button>
          <span className="text-sm text-gray-500 mx-2">›</span>
          <span className="text-sm text-gray-900">{user?.name || 'User'}</span>
        </nav>

        {/* User Header */}
        {user && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
            <p className="text-gray-600">
              {user.email} • {posts?.length || 0} {posts?.length === 1 ? 'Post' : 'Posts'}
            </p>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Post Card */}
          <div
            onClick={() => setShowForm(true)}
            className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors min-h-[200px]"
          >
            <div className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center mb-2">
              <span className="text-2xl text-black pb-1 font-semibold">+</span>
            </div>
            <p className="text-black font-bold">New Post</p>
          </div>

          {/* Existing Posts */}
          {posts && posts.length > 0 && posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              isDeleting={deletePostMutation.isPending}
            />
          ))}
        </div>

        {posts && posts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No posts yet. Click "New Post" to create your first post.
          </div>
        )}

        {/* Create Post Modal/Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">New Post</h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ title: '', body: '' });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                     Post Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                      Post Body
                    </label>
                    <textarea
                      id="body"
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setFormData({ title: '', body: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createPostMutation.isPending}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {createPostMutation.isPending ? 'Publishing...' : 'Publish'}
                    </button>
                  </div>
                  {createPostMutation.isError && (
                    <p className="mt-4 text-sm text-red-600">
                      {createPostMutation.error instanceof Error ? createPostMutation.error.message : 'Failed to publish post'}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPosts;

