-- Insert sample users
INSERT INTO users (user_id, email, username, password_hash) VALUES 
('user-1', 'demo@example.com', 'demo_user', 'hashed_password_123'),
('user-2', 'artist@example.com', 'creative_artist', 'hashed_password_456'),
('user-3', 'photographer@example.com', 'photo_pro', 'hashed_password_789')
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample images
INSERT INTO images (image_id, user_id, title, description, image_url, categories) VALUES 
('img-1', 'user-1', 'Beautiful Sunset', 'A stunning sunset over the mountains', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'nature,landscape,sunset'),
('img-2', 'user-2', 'City Lights', 'Urban nightscape with vibrant city lights', 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800', 'urban,city,night'),
('img-3', 'user-3', 'Ocean Waves', 'Peaceful ocean waves at dawn', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800', 'ocean,nature,peaceful'),
('img-4', 'user-1', 'Mountain Peak', 'Snow-capped mountain peak in winter', 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800', 'mountain,snow,winter'),
('img-5', 'user-2', 'Forest Path', 'A winding path through a green forest', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 'forest,path,nature'),
('img-6', 'user-3', 'Desert Dunes', 'Golden sand dunes in the desert', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800', 'desert,sand,golden')
ON CONFLICT (image_id) DO NOTHING;