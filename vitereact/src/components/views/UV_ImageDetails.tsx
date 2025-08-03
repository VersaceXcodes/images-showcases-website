import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Image, createCommentInputSchema, CreateCommentInput, createLikeInputSchema, CreateLikeInput } from '@schema';
import { useAppStore } from '@/store/main';
import { z } from 'zod';

const UV_ImageDetails: React.FC = () => {
  const { image_id } = useParams<{ image_id: string }>();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const currentUser = useAppStore(state => state.authentication_state.current_user);

  // Fetch Image Details
  const { data: imageDetails, isLoading, isError } = useQuery<Image, Error>(
    ['imageDetails', image_id],
    async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/${image_id}`);
      return response.data;
    }
  );

  // Mutation for liking an image
  const likeImageMutation = useMutation<void, Error, CreateLikeInput>({
    mutationFn: async (likeData) => {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/${image_id}/likes`, likeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['imageDetails', image_id]);
    },
  });

  // Mutation for adding a comment
  const addCommentMutation = useMutation<void, Error, CreateCommentInput>({
    mutationFn: async (newComment) => {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/${image_id}/comments`, newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['imageDetails', image_id]);
      setComment(''); // Reset comment input
    },
  });

  const handleLike = () => {
    if (currentUser) {
      likeImageMutation.mutate({ image_id, user_id: currentUser.id });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && comment.trim()) {
      const parsedComment = createCommentInputSchema.safeParse({ image_id, user_id: currentUser.id, content: comment });
      if (parsedComment.success) {
        addCommentMutation.mutate(parsedComment.data);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading image details</p>
      ) : (
        <>
          {imageDetails && (
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-bold mb-4">{imageDetails.title}</h2>
              <img src={imageDetails.image_url} alt={imageDetails.title} className="max-w-full h-auto mb-6" />
              <p className="text-gray-700 mb-4">{imageDetails.description}</p>
              <button 
                onClick={handleLike}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                aria-label="Like Image"
              >
                Like
              </button>

              <form onSubmit={handleCommentSubmit} className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full border rounded mb-2 p-2"
                  rows={4}
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                  aria-label="Submit Comment"
                >
                  Submit Comment
                </button>
              </form>

              <div className="mt-4">
                <Link to="/browse" className="text-blue-600 hover:underline">Back to Gallery</Link>
                <span className="mx-2">|</span>
                {imageDetails.user_id && (
                  <Link to={`/profile/${imageDetails.user_id}`} className="text-blue-600 hover:underline">View Uploader's Profile</Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UV_ImageDetails;