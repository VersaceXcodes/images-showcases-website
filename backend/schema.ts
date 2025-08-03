import { z } from 'zod';

// Users Entity Schema
export const userSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
  username: z.string(),
  password_hash: z.string(),
  profile_picture: z.string().url().nullable(),
  created_at: z.coerce.date(),
  auth_token: z.string().nullable(),
});

export const createUserInputSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1).max(255),
  password_hash: z.string().min(8),
  profile_picture: z.string().url().nullable().optional(),
});

export const updateUserInputSchema = z.object({
  user_id: z.string(),
  email: z.string().email().optional(),
  username: z.string().min(1).max(255).optional(),
  password_hash: z.string().min(8).optional(),
  profile_picture: z.string().url().nullable().optional(),
});

export const searchUserInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['username', 'created_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// Images Entity Schema
export const imageSchema = z.object({
  image_id: z.string(),
  user_id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  image_url: z.string().url(),
  categories: z.string().nullable(),
  uploaded_at: z.coerce.date(),
});

export const createImageInputSchema = z.object({
  user_id: z.string(),
  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  image_url: z.string().url(),
  categories: z.string().nullable().optional(),
});

export const updateImageInputSchema = z.object({
  image_id: z.string(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  image_url: z.string().url().optional(),
  categories: z.string().nullable().optional(),
});

export const searchImageInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['title', 'uploaded_at']).default('uploaded_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// Image Tags Entity Schema
export const imageTagSchema = z.object({
  image_id: z.string(),
  tag: z.string(),
});

export const createImageTagInputSchema = z.object({
  image_id: z.string(),
  tag: z.string().min(1).max(255),
});

export const updateImageTagInputSchema = z.object({
  image_id: z.string(),
  tag: z.string().min(1).max(255),
});

export const searchImageTagInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['tag']).default('tag'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// Comments Entity Schema
export const commentSchema = z.object({
  comment_id: z.string(),
  image_id: z.string(),
  user_id: z.string(),
  content: z.string(),
  created_at: z.coerce.date(),
});

export const createCommentInputSchema = z.object({
  image_id: z.string(),
  user_id: z.string(),
  content: z.string().min(1).max(500),
});

export const updateCommentInputSchema = z.object({
  comment_id: z.string(),
  content: z.string().min(1).max(500).optional(),
});

export const searchCommentInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['created_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// Likes Entity Schema
export const likeSchema = z.object({
  like_id: z.string(),
  image_id: z.string(),
  user_id: z.string(),
});

export const createLikeInputSchema = z.object({
  image_id: z.string(),
  user_id: z.string(),
});

export const updateLikeInputSchema = z.object({
  like_id: z.string(),
});

export const searchLikeInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['image_id']).default('image_id'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// Follows Entity Schema
export const followSchema = z.object({
  follower_id: z.string(),
  followed_id: z.string(),
});

export const createFollowInputSchema = z.object({
  follower_id: z.string(),
  followed_id: z.string(),
});

export const updateFollowInputSchema = z.object({
  follower_id: z.string(),
  followed_id: z.string(),
});

export const searchFollowInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['follower_id']).default('follower_id'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// Collections Entity Schema
export const collectionSchema = z.object({
  collection_id: z.string(),
  user_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
});

export const createCollectionInputSchema = z.object({
  user_id: z.string(),
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
});

export const updateCollectionInputSchema = z.object({
  collection_id: z.string(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
});

export const searchCollectionInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['name', 'created_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// Collection Images Entity Schema
export const collectionImageSchema = z.object({
  collection_id: z.string(),
  image_id: z.string(),
});

export const createCollectionImageInputSchema = z.object({
  collection_id: z.string(),
  image_id: z.string(),
});

export const updateCollectionImageInputSchema = z.object({
  collection_id: z.string(),
  image_id: z.string(),
});

export const searchCollectionImageInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['collection_id']).default('collection_id'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// Favorites Entity Schema
export const favoriteSchema = z.object({
  favorite_id: z.string(),
  user_id: z.string(),
  image_id: z.string(),
});

export const createFavoriteInputSchema = z.object({
  user_id: z.string(),
  image_id: z.string(),
});

export const updateFavoriteInputSchema = z.object({
  favorite_id: z.string(),
});

export const searchFavoriteInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['user_id']).default('user_id'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// Notifications Entity Schema
export const notificationSchema = z.object({
  notification_id: z.string(),
  user_id: z.string(),
  type: z.string(),
  entity_id: z.string().nullable(),
  message: z.string(),
  created_at: z.coerce.date(),
  is_read: z.boolean(),
});

export const createNotificationInputSchema = z.object({
  user_id: z.string(),
  type: z.string(),
  entity_id: z.string().nullable().optional(),
  message: z.string().min(1),
  is_read: z.boolean().optional().default(false),
});

export const updateNotificationInputSchema = z.object({
  notification_id: z.string(),
  is_read: z.boolean().optional(),
});

export const searchNotificationInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['created_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// inferred types
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type SearchUserInput = z.infer<typeof searchUserInputSchema>;

export type Image = z.infer<typeof imageSchema>;
export type CreateImageInput = z.infer<typeof createImageInputSchema>;
export type UpdateImageInput = z.infer<typeof updateImageInputSchema>;
export type SearchImageInput = z.infer<typeof searchImageInputSchema>;

export type ImageTag = z.infer<typeof imageTagSchema>;
export type CreateImageTagInput = z.infer<typeof createImageTagInputSchema>;
export type UpdateImageTagInput = z.infer<typeof updateImageTagInputSchema>;
export type SearchImageTagInput = z.infer<typeof searchImageTagInputSchema>;

export type Comment = z.infer<typeof commentSchema>;
export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentInputSchema>;
export type SearchCommentInput = z.infer<typeof searchCommentInputSchema>;

export type Like = z.infer<typeof likeSchema>;
export type CreateLikeInput = z.infer<typeof createLikeInputSchema>;
export type UpdateLikeInput = z.infer<typeof updateLikeInputSchema>;
export type SearchLikeInput = z.infer<typeof searchLikeInputSchema>;

export type Follow = z.infer<typeof followSchema>;
export type CreateFollowInput = z.infer<typeof createFollowInputSchema>;
export type UpdateFollowInput = z.infer<typeof updateFollowInputSchema>;
export type SearchFollowInput = z.infer<typeof searchFollowInputSchema>;

export type Collection = z.infer<typeof collectionSchema>;
export type CreateCollectionInput = z.infer<typeof createCollectionInputSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionInputSchema>;
export type SearchCollectionInput = z.infer<typeof searchCollectionInputSchema>;

export type CollectionImage = z.infer<typeof collectionImageSchema>;
export type CreateCollectionImageInput = z.infer<typeof createCollectionImageInputSchema>;
export type UpdateCollectionImageInput = z.infer<typeof updateCollectionImageInputSchema>;
export type SearchCollectionImageInput = z.infer<typeof searchCollectionImageInputSchema>;

export type Favorite = z.infer<typeof favoriteSchema>;
export type CreateFavoriteInput = z.infer<typeof createFavoriteInputSchema>;
export type UpdateFavoriteInput = z.infer<typeof updateFavoriteInputSchema>;
export type SearchFavoriteInput = z.infer<typeof searchFavoriteInputSchema>;

export type Notification = z.infer<typeof notificationSchema>;
export type CreateNotificationInput = z.infer<typeof createNotificationInputSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationInputSchema>;
export type SearchNotificationInput = z.infer<typeof searchNotificationInputSchema>;