import request from 'supertest';
import { server } from '../src/server';

describe('GET /', () => {
  it('should return the main page', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Main Page Content'); // Adjust based on actual content
  });
});