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

