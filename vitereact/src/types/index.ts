// Basic types for the application
export interface User {
  user_id: string;
  email: string;
  username: string;
  password_hash: string;
  profile_picture: string | null;
  created_at: Date;
  auth_token: string | null;
  name?: string;
}

export interface CreateUserInput {
  email: string;
  username: string;
  password_hash: string;
  profile_picture?: string | null;
}

export interface UpdateUserInput {
  user_id: string;
  email?: string;
  username?: string;
  password_hash?: string;
  profile_picture?: string | null;
}

export interface Image {
  image_id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string;
  categories: string | null;
  uploaded_at: Date;
  url?: string;
  tags?: string[];
}

export interface CreateImageInput {
  user_id: string;
  title: string;
  description?: string | null;
  image_url: string;
  categories?: string | null;
}

export interface UpdateImageInput {
  image_id: string;
  title?: string;
  description?: string | null;
  image_url?: string;
  categories?: string | null;
}

export interface Collection {
  collection_id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface CreateCollectionInput {
  user_id: string;
  name: string;
  description?: string | null;
}

export interface UpdateCollectionInput {
  collection_id: string;
  name?: string;
  description?: string | null;
}

export interface Comment {
  comment_id: string;
  image_id: string;
  user_id: string;
  content: string;
  created_at: Date;
}

export interface CreateCommentInput {
  image_id: string;
  user_id: string;
  content: string;
}

export interface UpdateCommentInput {
  comment_id: string;
  content?: string;
}

export interface Like {
  like_id: string;
  image_id: string;
  user_id: string;
}

export interface CreateLikeInput {
  image_id: string;
  user_id: string;
}

export interface Follow {
  follower_id: string;
  following_id: string;
}

export interface CreateFollowInput {
  follower_id: string;
  following_id: string;
}

export interface Notification {
  notification_id: string;
  user_id: string;
  type: string;
  entity_id: string | null;
  message: string;
  created_at: Date;
  is_read: boolean;
}

export interface CreateNotificationInput {
  user_id: string;
  type: string;
  entity_id?: string | null;
  message: string;
  is_read?: boolean;
}

export interface UpdateNotificationInput {
  notification_id: string;
  is_read?: boolean;
}

// Additional types that might be used in the frontend
export interface FeaturedGallery {
  id: string;
  title: string;
  description: string;
  images: Image[];
  created_at: Date;
}

export interface UserProfileType {
  user_id: string;
  username: string;
  email: string;
  profile_picture?: string;
  bio?: string;
  followers?: number;
  following?: number;
  personal_links?: string[];
  avatar_url?: string;
}

export interface NewShowcaseData {
  title: string;
  description: string;
  tags: string[];
  images: string[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}