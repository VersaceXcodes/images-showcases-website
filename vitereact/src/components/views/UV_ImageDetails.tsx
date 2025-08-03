import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Image, Comment, CreateCommentInput } from '@schema';

// Fetch detailed information about a specific image
const fetchImageDetails = async (image_id: string): Promise<Image> => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/${image_id}`);
  return data;
};

// Fetch related images based on tags and categories
const fetchRelatedImages = async (query: string, category: string): Promise<Image[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/search`, {
    params: { query, category, limit: 5 }
  });
  return data;
};

const UV_ImageDetails: React.FC = () => {
  const { image_id } = useParams<{ image_id: string }>();
  
  const currentUser = useAppStore(state => state.authentication_state.current_user);
  const authToken = useAppStore(state => state.authentication_state.auth_token);
  
  const imageQuery = useQuery<Image, Error>({
    queryKey: ['imageDetails', image_id],
    queryFn: () => fetchImageDetails(image_id!),
    enabled: !!image_id,
  });

  const relatedImagesQuery = useQuery<Image[], Error>({
    queryKey: ['relatedImages', imageQuery.data?.categories],
    queryFn: () => fetchRelatedImages(imageQuery.data!.title, imageQuery.data!.categories || ''),
    enabled: !!imageQuery.data?.title,
  });

  const createComment = useMutation<Comment, Error, CreateCommentInput>({
    mutationFn: async (newComment) => {
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/comments`, newComment, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      return data;
    },
    onSuccess: () => {
      // Optionally refresh comments or consider real-time updates with websockets
    },
  });

  const addLike = useMutation<void, Error>({
    mutationFn: async () => {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/likes`, {
        image_id,
        user_id: currentUser?.user_id
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    },
  });

  return (
    <>
      <div className="min-h-screen bg-white p-4">
        {imageQuery.isLoading ? (
          <div>Loading...</div>
        ) : imageQuery.isError ? (
          <div aria-live="polite" className="text-red-600">Error loading image details: {imageQuery.error.message}</div>
        ) : (
          <>
            <div className="mb-6">
              <img
                src={imageQuery.data?.image_url}
                alt={imageQuery.data?.title}
                className="mx-auto max-w-full h-auto"
              />
              <div className="mt-2 text-center">
                <h1 className="text-2xl font-bold">{imageQuery.data?.title}</h1>
                <p className="text-gray-700">{imageQuery.data?.description}</p>
                <div className="text-sm text-gray-500">
                  Uploaded by: <Link to={`/profile/${imageQuery.data?.user_id}`} className="text-blue-500 hover:underline">{imageQuery.data?.user_id}</Link>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => addLike.mutate()}
                className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2"
                aria-label="Like Image"
              >
                Like
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Comments</h2>
              {/* Here you can map over available comments */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const content = (e.target as HTMLFormElement).comment.value;
                  if (currentUser) {
                    createComment.mutate({ image_id: image_id!, user_id: currentUser.user_id, content });
                  }
                }}
              >
                <textarea name="comment" className="border rounded-md w-full p-2" placeholder="Add a comment" />
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 mt-2">
                  Post Comment
                </button>
              </form>
            </div>

            {relatedImagesQuery.isLoading ? (
              <div>Loading related images...</div>
            ) : relatedImagesQuery.isError ? (
              <div aria-live="polite" className="text-red-600">Error loading related images: {relatedImagesQuery.error.message}</div>
            ) : (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Related Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {relatedImagesQuery.data?.map((image) => (
                    <Link to={`/image/${image.image_id}`} key={image.image_id}>
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="object-cover w-full h-32 rounded-md"
                      />
                      <div className="text-sm text-gray-600 mt-1 truncate">{image.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default UV_ImageDetails;