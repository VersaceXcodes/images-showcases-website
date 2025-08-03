import request from 'supertest';
import { app, pool } from './server.ts';
import { createUserInputSchema } from './db:zodschemas:ts';
import { createJWT } from './utils/authUtils';

describe('Backend Tests for Images Showcase Haven', () => {
  let authToken = '';

  beforeAll(async () => {
    // Clear database or setup initial state if needed
    // Create a registered user to obtain a token
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password_hash: 'password123' });
    
    authToken = registerResponse.body.auth_token;
  });

  afterAll(async () => {
    // Cleanup database
    await pool.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
    await pool.end();
  });

  describe('User Registration and Authentication', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ username: 'newuser', email: 'newuser@example.com', password_hash: 'mypassword' });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('auth_token');
    });

    it('should not register a user with an existing email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ username: 'dupeuser', email: 'newuser@example.com', password_hash: 'pass123' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email already exists');
    });

    it('should login user with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('auth_token');
    });
    
    it('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrongpass' });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });
  });

  describe('Showcase Management', () => {
    const showcaseData = {
      user_id: 'some-user-id',
      title: 'Nature Collection',
      description: 'A beautiful collection of nature photos.',
      tags: ['nature', 'photography'],
      category: 'Photography'
    };

    it('should create a new showcase', async () => {
      const response = await request(app)
        .post('/showcases')
        .set('Authorization', `Bearer ${authToken}`)
        .send(showcaseData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('showcase_id');
    });

    it('should find a specific showcase by ID', async () => {
      const response = await request(app)
        .get(`/showcases/${showcaseData.showcase_id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(showcaseData);
    });

    it('should update a showcase', async () => {
      const updateData = { title: 'Updated Nature Collection' };
      const response = await request(app)
        .put(`/showcases/${showcaseData.showcase_id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe(updateData.title);
    });

    it('should delete a showcase', async () => {
      const response = await request(app)
        .delete(`/showcases/${showcaseData.showcase_id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(204);
    });
  });

  describe('Image Upload and Management', () => {
    let showcaseId = '';

    beforeAll(async () => {
      const showcaseResponse = await request(app)
        .post('/showcases')
        .set('Authorization', `Bearer ${authToken}`)
        .send(showcaseData);
      
      showcaseId = showcaseResponse.body.showcase_id;
    });

    const imageData = {
      showcase_id: showcaseId,
      url: 'https://picsum.photos/300',
      title: 'Sample Image',
      description: 'A sample image for testing purposes.'
    };

    it('should upload an image to a showcase', async () => {
      const response = await request(app)
        .post('/images')
        .set('Authorization', `Bearer ${authToken}`)
        .send(imageData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('image_id');
    });

    it('should retrieve an image by ID', async () => {
      const response = await request(app)
        .get(`/images/${imageData.image_id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(imageData);
    });

    it('should update an existing image', async () => {
      const updateData = { title: 'Updated Image Title' };
      const response = await request(app)
        .put(`/images/${imageData.image_id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe(updateData.title);
    });

    it('should delete an image', async () => {
      const response = await request(app)
        .delete(`/images/${imageData.image_id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(204);
    });
  });

  describe('Commenting System', () => {
    let imageId = '';

    beforeAll(async () => {
      const imageResponse = await request(app)
        .post('/images')
        .set('Authorization', `Bearer ${authToken}`)
        .send(imageData);
      
      imageId = imageResponse.body.image_id;
    });

    const commentData = {
      user_id: 'some-user-id',
      image_id: imageId,
      content: 'Nice picture!'
    };

    it('should post a comment on an image', async () => {
      const response = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('comment_id');
    });

    it('should retrieve a comment by ID', async () => {
      const response = await request(app)
        .get(`/comments/${commentData.comment_id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(commentData);
    });

    it('should update a comment', async () => {
      const updateData = { content: 'Updated comment.' };
      const response = await request(app)
        .put(`/comments/${commentData.comment_id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.content).toBe(updateData.content);
    });

    it('should delete a comment', async () => {
      const response = await request(app)
        .delete(`/comments/${commentData.comment_id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(204);
    });
  });

  describe('WebSocket Events', () => {
    // Mock WebSocket server and test for events
    // Example using a library like socket.io-client or ws for WebSocket client interactions
  });
});