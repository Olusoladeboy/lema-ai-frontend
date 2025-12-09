import type { PostCardProps } from '../types';
import TrashIcon from '../assets/icons/TrashIcon';

const PostCard = ({ post, onDelete, isDeleting = false }: PostCardProps) => {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-6 relative h-[293px] w-[270px] flex flex-col overflow-hidden"
      style={{
        boxShadow: '0px 2px 4px -1px #0000000F, 0px 4px 6px -1px #0000001A',
      }}
    >
      <button
        onClick={() => onDelete(post.id)}
        disabled={isDeleting}
        className="absolute top-4 right-4 text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors z-10"
        title="Delete post"
      >
        <TrashIcon />
      </button>
      <h3 
        className="text-lg font-semibold text-gray-900 mb-3 pr-8 flex-shrink-0"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.5',
        }}
        title={post.title}
      >
        {post.title}
      </h3>
      <div className="flex-grow overflow-hidden">
        <p 
          className="text-gray-600 text-sm m-0"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 8,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.5',
          }}
          title={post.body}
        >
          {post.body}
        </p>
      </div>
    </div>
  );
};

export default PostCard;

