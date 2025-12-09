import type { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  address?: string; // Formatted address: "street, state, city, zipcode"
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
}

export interface CreatePostRequest {
  title: string;
  body: string;
  userId: string;
}

export interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
  isDeleting?: boolean;
}

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  postTitle?: string;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface CloseIconProps {
  className?: string;
}

export interface TrashIconProps {
  className?: string;
}

