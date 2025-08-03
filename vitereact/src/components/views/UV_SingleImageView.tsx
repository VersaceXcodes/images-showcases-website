import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';
import { Image, Comment, CreateCommentInput } from '@schema';

const UV_SingleImageView: React.FC = () => {
  const { image_id } = useParams<{ image_id: string }>();
  const [newComment, setNewComment] = useState('');
  const currentUser = useAppStore((state) => state.authentication_state.current_user);

  // Fetch image details
  const { data: imageDetails, isLoading: isImageLoading, error: imageError } = useQuery<Image, Error>(
    ['imageDetails', image_id],
    async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/${image_id}`);
      return response.data;
    }
  );

  // Fetch image comments
  const { data: comments, refetch: refetchComments } = useQuery<Comment[], Error>(
    ['imageComments', image_id],
    async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/${image_id}/comments`);
      return response.data;
    }
  );

  // Like an image
  const likeMutation = useMutation<void, Error>(() => {
    return axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/${image_id}/like`, {
      user_id: currentUser?.user_id,
    });
  });

  // Add a new comment
  const addCommentMutation = useMutation<Comment, Error, CreateCommentInput>({
    mutationFn: async (newCommentData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/${image_id}/comments`,
        newCommentData
      );
      return response.data;
    },
    onSuccess: () => {
      refetchComments();
      setNewComment('');
    },
  });

  const handleAddComment = () => {
    if (newComment.trim() && currentUser) {
      addCommentMutation.mutate({ image_id: image_id!, user_id: currentUser.user_id, content: newComment.trim() });
    }
  };

  if (isImageLoading) {
    return <div>Loading...</div>;
  }

  if (imageError) {
    return <div>Error loading image details</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        {imageDetails && (
          <div className="flex flex-col items-center">
            <img src={imageDetails.url} alt={imageDetails.title} className="max-w-full h-auto" />
            <h2 className="text-xl font-bold my-2">{imageDetails.title}</h2>
            <p className="text-gray-700">{imageDetails.description}</p>
            <div className="mt-2">
              {imageDetails.tags && imageDetails.tags.map((tag) => (
                <span key={tag} className="bg-gray-200 rounded-full text-sm px-2 py-1 m-1">{tag}</span>
              ))}
            </div>
            <button
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
              onClick={() => likeMutation.mutate()}
            >
              {likeMutation.isLoading ? 'Liking...' : 'Like'}
            </button>
            <div className="mt-6 w-full">
              <h3 className="text-lg font-semibold">Comments</h3>
              <div className="mt-4">
                {comments && comments.map((comment) => (
                  <div key={comment.comment_id} className="border-b border-gray-300 py-2">
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="border border-gray-300 p-2 flex-grow rounded"
                  placeholder="Add a comment..."
                />
                <button onClick={handleAddComment} className="ml-2 py-2 px-4 bg-green-500 text-white rounded">
                  {addCommentMutation.isLoading ? 'Adding...' : 'Add Comment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UV_SingleImageView;