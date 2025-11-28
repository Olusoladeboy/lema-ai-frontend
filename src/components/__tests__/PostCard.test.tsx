import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostCard from '../PostCard';
import type { Post } from '../../types';

// Mock the delete function
const mockDeletePost = vi.fn();

describe('PostCard', () => {
  const mockPost: Post = {
    id: '1',
    user_id: 'user1',
    title: 'Test Post',
    body: 'This is a test post body',
    created_at: '2024-01-01T00:00:00Z',
  };

  it('should render post title and body', () => {
    render(<PostCard post={mockPost} onDelete={mockDeletePost} />);

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test post body')).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<PostCard post={mockPost} onDelete={mockDeletePost} />);

    const deleteButton = screen.getByTitle('Delete post');
    await user.click(deleteButton);

    expect(mockDeletePost).toHaveBeenCalledWith('1');
  });

  it('should display formatted date', () => {
    render(<PostCard post={mockPost} onDelete={mockDeletePost} />);

    const dateElement = screen.getByText(/2024/);
    expect(dateElement).toBeInTheDocument();
  });
});

