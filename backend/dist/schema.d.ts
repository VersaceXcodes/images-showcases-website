import { z } from 'zod';
export declare const userSchema: z.ZodObject<{
    user_id: z.ZodString;
    email: z.ZodString;
    username: z.ZodString;
    password_hash: z.ZodString;
    profile_picture: z.ZodNullable<z.ZodString>;
    created_at: z.ZodDate;
    auth_token: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    email?: string;
    username?: string;
    password_hash?: string;
    profile_picture?: string;
    created_at?: Date;
    auth_token?: string;
}, {
    user_id?: string;
    email?: string;
    username?: string;
    password_hash?: string;
    profile_picture?: string;
    created_at?: Date;
    auth_token?: string;
}>;
export declare const createUserInputSchema: z.ZodObject<{
    email: z.ZodString;
    username: z.ZodString;
    password_hash: z.ZodString;
    profile_picture: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email?: string;
    username?: string;
    password_hash?: string;
    profile_picture?: string;
}, {
    email?: string;
    username?: string;
    password_hash?: string;
    profile_picture?: string;
}>;
export declare const updateUserInputSchema: z.ZodObject<{
    user_id: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    password_hash: z.ZodOptional<z.ZodString>;
    profile_picture: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    email?: string;
    username?: string;
    password_hash?: string;
    profile_picture?: string;
}, {
    user_id?: string;
    email?: string;
    username?: string;
    password_hash?: string;
    profile_picture?: string;
}>;
export declare const searchUserInputSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["username", "created_at"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "username" | "created_at";
    sort_order?: "asc" | "desc";
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "username" | "created_at";
    sort_order?: "asc" | "desc";
}>;
export declare const imageSchema: z.ZodObject<{
    image_id: z.ZodString;
    user_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    image_url: z.ZodString;
    categories: z.ZodNullable<z.ZodString>;
    uploaded_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    image_id?: string;
    title?: string;
    description?: string;
    image_url?: string;
    categories?: string;
    uploaded_at?: Date;
}, {
    user_id?: string;
    image_id?: string;
    title?: string;
    description?: string;
    image_url?: string;
    categories?: string;
    uploaded_at?: Date;
}>;
export declare const createImageInputSchema: z.ZodObject<{
    user_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image_url: z.ZodString;
    categories: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    title?: string;
    description?: string;
    image_url?: string;
    categories?: string;
}, {
    user_id?: string;
    title?: string;
    description?: string;
    image_url?: string;
    categories?: string;
}>;
export declare const updateImageInputSchema: z.ZodObject<{
    image_id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image_url: z.ZodOptional<z.ZodString>;
    categories: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    image_id?: string;
    title?: string;
    description?: string;
    image_url?: string;
    categories?: string;
}, {
    image_id?: string;
    title?: string;
    description?: string;
    image_url?: string;
    categories?: string;
}>;
export declare const searchImageInputSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["title", "uploaded_at"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "title" | "uploaded_at";
    sort_order?: "asc" | "desc";
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "title" | "uploaded_at";
    sort_order?: "asc" | "desc";
}>;
export declare const imageTagSchema: z.ZodObject<{
    image_id: z.ZodString;
    tag: z.ZodString;
}, "strip", z.ZodTypeAny, {
    image_id?: string;
    tag?: string;
}, {
    image_id?: string;
    tag?: string;
}>;
export declare const createImageTagInputSchema: z.ZodObject<{
    image_id: z.ZodString;
    tag: z.ZodString;
}, "strip", z.ZodTypeAny, {
    image_id?: string;
    tag?: string;
}, {
    image_id?: string;
    tag?: string;
}>;
export declare const updateImageTagInputSchema: z.ZodObject<{
    image_id: z.ZodString;
    tag: z.ZodString;
}, "strip", z.ZodTypeAny, {
    image_id?: string;
    tag?: string;
}, {
    image_id?: string;
    tag?: string;
}>;
export declare const searchImageTagInputSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["tag"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "tag";
    sort_order?: "asc" | "desc";
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "tag";
    sort_order?: "asc" | "desc";
}>;
export declare const commentSchema: z.ZodObject<{
    comment_id: z.ZodString;
    image_id: z.ZodString;
    user_id: z.ZodString;
    content: z.ZodString;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    created_at?: Date;
    image_id?: string;
    comment_id?: string;
    content?: string;
}, {
    user_id?: string;
    created_at?: Date;
    image_id?: string;
    comment_id?: string;
    content?: string;
}>;
export declare const createCommentInputSchema: z.ZodObject<{
    image_id: z.ZodString;
    user_id: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    image_id?: string;
    content?: string;
}, {
    user_id?: string;
    image_id?: string;
    content?: string;
}>;
export declare const updateCommentInputSchema: z.ZodObject<{
    comment_id: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    comment_id?: string;
    content?: string;
}, {
    comment_id?: string;
    content?: string;
}>;
export declare const searchCommentInputSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["created_at"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "created_at";
    sort_order?: "asc" | "desc";
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "created_at";
    sort_order?: "asc" | "desc";
}>;
export declare const likeSchema: z.ZodObject<{
    like_id: z.ZodString;
    image_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    image_id?: string;
    like_id?: string;
}, {
    user_id?: string;
    image_id?: string;
    like_id?: string;
}>;
export declare const createLikeInputSchema: z.ZodObject<{
    image_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    image_id?: string;
}, {
    user_id?: string;
    image_id?: string;
}>;
export declare const updateLikeInputSchema: z.ZodObject<{
    like_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    like_id?: string;
}, {
    like_id?: string;
}>;
export declare const searchLikeInputSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["image_id"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "image_id";
    sort_order?: "asc" | "desc";
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "image_id";
    sort_order?: "asc" | "desc";
}>;
export declare const followSchema: z.ZodObject<{
    follower_id: z.ZodString;
    followed_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    follower_id?: string;
    followed_id?: string;
}, {
    follower_id?: string;
    followed_id?: string;
}>;
export declare const createFollowInputSchema: z.ZodObject<{
    follower_id: z.ZodString;
    followed_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    follower_id?: string;
    followed_id?: string;
}, {
    follower_id?: string;
    followed_id?: string;
}>;
export declare const updateFollowInputSchema: z.ZodObject<{
    follower_id: z.ZodString;
    followed_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    follower_id?: string;
    followed_id?: string;
}, {
    follower_id?: string;
    followed_id?: string;
}>;
export declare const searchFollowInputSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["follower_id"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "follower_id";
    sort_order?: "asc" | "desc";
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "follower_id";
    sort_order?: "asc" | "desc";
}>;
export declare const collectionSchema: z.ZodObject<{
    collection_id: z.ZodString;
    user_id: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    created_at?: Date;
    description?: string;
    collection_id?: string;
    name?: string;
}, {
    user_id?: string;
    created_at?: Date;
    description?: string;
    collection_id?: string;
    name?: string;
}>;
export declare const createCollectionInputSchema: z.ZodObject<{
    user_id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    description?: string;
    name?: string;
}, {
    user_id?: string;
    description?: string;
    name?: string;
}>;
export declare const updateCollectionInputSchema: z.ZodObject<{
    collection_id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    description?: string;
    collection_id?: string;
    name?: string;
}, {
    description?: string;
    collection_id?: string;
    name?: string;
}>;
export declare const searchCollectionInputSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["name", "created_at"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "created_at" | "name";
    sort_order?: "asc" | "desc";
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "created_at" | "name";
    sort_order?: "asc" | "desc";
}>;
export declare const collectionImageSchema: z.ZodObject<{
    collection_id: z.ZodString;
    image_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    image_id?: string;
    collection_id?: string;
}, {
    image_id?: string;
    collection_id?: string;
}>;
export declare const createCollectionImageInputSchema: z.ZodObject<{
    collection_id: z.ZodString;
    image_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    image_id?: string;
    collection_id?: string;
}, {
    image_id?: string;
    collection_id?: string;
}>;
export declare const updateCollectionImageInputSchema: z.ZodObject<{
    collection_id: z.ZodString;
    image_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    image_id?: string;
    collection_id?: string;
}, {
    image_id?: string;
    collection_id?: string;
}>;
export declare const searchCollectionImageInputSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["collection_id"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "collection_id";
    sort_order?: "asc" | "desc";
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "collection_id";
    sort_order?: "asc" | "desc";
}>;
export declare const favoriteSchema: z.ZodObject<{
    favorite_id: z.ZodString;
    user_id: z.ZodString;
    image_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    image_id?: string;
    favorite_id?: string;
}, {
    user_id?: string;
    image_id?: string;
    favorite_id?: string;
}>;
export declare const createFavoriteInputSchema: z.ZodObject<{
    user_id: z.ZodString;
    image_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    image_id?: string;
}, {
    user_id?: string;
    image_id?: string;
}>;
export declare const updateFavoriteInputSchema: z.ZodObject<{
    favorite_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    favorite_id?: string;
}, {
    favorite_id?: string;
}>;
export declare const searchFavoriteInputSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["user_id"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "user_id";
    sort_order?: "asc" | "desc";
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "user_id";
    sort_order?: "asc" | "desc";
}>;
export declare const notificationSchema: z.ZodObject<{
    notification_id: z.ZodString;
    user_id: z.ZodString;
    type: z.ZodString;
    entity_id: z.ZodNullable<z.ZodString>;
    message: z.ZodString;
    created_at: z.ZodDate;
    is_read: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    created_at?: Date;
    message?: string;
    type?: string;
    notification_id?: string;
    entity_id?: string;
    is_read?: boolean;
}, {
    user_id?: string;
    created_at?: Date;
    message?: string;
    type?: string;
    notification_id?: string;
    entity_id?: string;
    is_read?: boolean;
}>;
export declare const createNotificationInputSchema: z.ZodObject<{
    user_id: z.ZodString;
    type: z.ZodString;
    entity_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    message: z.ZodString;
    is_read: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    message?: string;
    type?: string;
    entity_id?: string;
    is_read?: boolean;
}, {
    user_id?: string;
    message?: string;
    type?: string;
    entity_id?: string;
    is_read?: boolean;
}>;
export declare const updateNotificationInputSchema: z.ZodObject<{
    notification_id: z.ZodString;
    is_read: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    notification_id?: string;
    is_read?: boolean;
}, {
    notification_id?: string;
    is_read?: boolean;
}>;
export declare const searchNotificationInputSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["created_at"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "created_at";
    sort_order?: "asc" | "desc";
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "created_at";
    sort_order?: "asc" | "desc";
}>;
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
export declare const showcaseSchema: z.ZodObject<{
    showcase_id: z.ZodString;
    user_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    tags: z.ZodArray<z.ZodString, "many">;
    images: z.ZodArray<z.ZodString, "many">;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    created_at?: Date;
    title?: string;
    description?: string;
    showcase_id?: string;
    tags?: string[];
    images?: string[];
}, {
    user_id?: string;
    created_at?: Date;
    title?: string;
    description?: string;
    showcase_id?: string;
    tags?: string[];
    images?: string[];
}>;
export declare const createShowcaseInputSchema: z.ZodObject<{
    user_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    title?: string;
    description?: string;
    tags?: string[];
    images?: string[];
}, {
    user_id?: string;
    title?: string;
    description?: string;
    tags?: string[];
    images?: string[];
}>;
export type Showcase = z.infer<typeof showcaseSchema>;
export type CreateShowcaseInput = z.infer<typeof createShowcaseInputSchema>;
export declare const userProfileSchema: z.ZodObject<{
    user_id: z.ZodString;
    username: z.ZodString;
    email: z.ZodString;
    profile_picture: z.ZodNullable<z.ZodString>;
    bio: z.ZodNullable<z.ZodString>;
    followers: z.ZodNumber;
    following: z.ZodNumber;
    personal_links: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    avatar_url: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    email?: string;
    username?: string;
    profile_picture?: string;
    bio?: string;
    followers?: number;
    following?: number;
    personal_links?: string[];
    avatar_url?: string;
}, {
    user_id?: string;
    email?: string;
    username?: string;
    profile_picture?: string;
    bio?: string;
    followers?: number;
    following?: number;
    personal_links?: string[];
    avatar_url?: string;
}>;
export type UserProfile = z.infer<typeof userProfileSchema>;
//# sourceMappingURL=schema.d.ts.map