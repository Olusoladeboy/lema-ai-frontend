import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts, useCreatePost, useDeletePost } from '../hooks/usePosts';
import { useUser } from '../hooks/useUser';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import CloseIcon from '../assets/icons/CloseIcon';
import toast, { Toaster } from 'react-hot-toast';
import type { CreatePostRequest } from '../types';

const TITLE_MAX_LENGTH = 100;
const BODY_MAX_LENGTH = 500;

const UserPosts = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [deletePostTitle, setDeletePostTitle] = useState<string>('');

  const { data: posts, isLoading: postsLoading, isError: postsError, error: postsErrorMsg } = usePosts(userId || '');
  const { data: user, isLoading: userLoading } = useUser(userId);
  const createPostMutation = useCreatePost();
  const deletePostMutation = useDeletePost(userId || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !formData.title.trim() || !formData.body.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check character limits
    if (formData.title.trim().length > TITLE_MAX_LENGTH) {
      toast.error(`Title must be ${TITLE_MAX_LENGTH} characters or less. Current: ${formData.title.trim().length}`);
      return;
    }

    if (formData.body.trim().length > BODY_MAX_LENGTH) {
      toast.error(`Body must be ${BODY_MAX_LENGTH} characters or less. Current: ${formData.body.trim().length}`);
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
      toast.success('Post created successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      toast.error(errorMessage);
      console.error('Error creating post:', error);
    }
  };

  const handleDeleteClick = (postId: string) => {
    const post = posts?.find((p) => p.id === postId);
    setDeletePostId(postId);
    setDeletePostTitle(post?.title || '');
  };

  const handleDeleteConfirm = async () => {
    if (!deletePostId) return;

    try {
      await deletePostMutation.mutateAsync(deletePostId);
      setDeletePostId(null);
      setDeletePostTitle('');
      toast.success('Post deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
      toast.error(errorMessage);
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeletePostId(null);
    setDeletePostTitle('');
  };

  if (postsLoading || userLoading) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 flex items-center justify-center">
        <div className="max-w-4xl w-full flex justify-center">
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
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-white py-8 px-4 flex items-center justify-center">
        <div className="max-w-4xl w-full">
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
          <div className="flex flex-wrap gap-6 md:gap-6 justify-center lg:justify-start">
            {/* New Post Card */}
            <div
              onClick={() => setShowForm(true)}
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors h-[293px] w-[270px]"
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
                onDelete={handleDeleteClick}
                isDeleting={deletePostMutation.isPending && deletePostId === post.id}
              />
            ))}
          </div>

          {posts && posts.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No posts yet. Click "New Post" to create your first post.
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={deletePostId !== null}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            isDeleting={deletePostMutation.isPending}
            postTitle={deletePostTitle}
          />

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
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Post Title
                        </label>
                        <span className={`text-xs ${formData.title.length > TITLE_MAX_LENGTH ? 'text-red-600' : 'text-gray-500'}`}>
                          {formData.title.length}/{TITLE_MAX_LENGTH}
                        </span>
                      </div>
                      <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        maxLength={TITLE_MAX_LENGTH}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {formData.title.length > TITLE_MAX_LENGTH && (
                        <p className="mt-1 text-sm text-red-600">
                          Title must be {TITLE_MAX_LENGTH} characters or less
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                          Post Body
                        </label>
                        <span className={`text-xs ${formData.body.length > BODY_MAX_LENGTH ? 'text-red-600' : 'text-gray-500'}`}>
                          {formData.body.length}/{BODY_MAX_LENGTH}
                        </span>
                      </div>
                      <textarea
                        id="body"
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        maxLength={BODY_MAX_LENGTH}
                        rows={6}
                        style={{ resize: 'none' }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {formData.body.length > BODY_MAX_LENGTH && (
                        <p className="mt-1 text-sm text-red-600">
                          Body must be {BODY_MAX_LENGTH} characters or less
                        </p>
                      )}
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
                        disabled={createPostMutation.isPending || formData.title.length > TITLE_MAX_LENGTH || formData.body.length > BODY_MAX_LENGTH}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {createPostMutation.isPending ? 'Publishing...' : 'Publish'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserPosts;
