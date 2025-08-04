import React from 'react';

const UV_About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About 123Images</h1>
          
          <div className="prose prose-lg text-gray-700">
            <p className="mb-6">
              Welcome to 123Images, your premier destination for discovering and sharing stunning visual content. 
              Our platform brings together photographers, artists, and visual enthusiasts from around the world 
              to showcase their creativity and inspire others.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="mb-6">
              We believe that every image tells a story. Our mission is to provide a platform where creators 
              can share their visual narratives, connect with like-minded individuals, and build a community 
              centered around the appreciation of visual art and photography.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>High-quality image showcases from talented creators worldwide</li>
              <li>Easy-to-use upload and sharing tools</li>
              <li>Community features including comments, likes, and follows</li>
              <li>Curated galleries and featured collections</li>
              <li>Advanced search and discovery features</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Our Community</h2>
            <p className="mb-6">
              Whether you're a professional photographer, an aspiring artist, or simply someone who 
              appreciates beautiful imagery, 123Images welcomes you. Join our growing community and 
              start sharing your visual stories today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UV_About;