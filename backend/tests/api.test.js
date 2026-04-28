const request = require('supertest');
const app = require('../src/index');

describe('GET /health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/items', () => {
  it('returns an array of items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('POST /api/items', () => {
  it('creates an item with valid body', async () => {
    const res = await request(app).post('/api/items').send({ name: 'Item C' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Item C');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/items').send({});
    expect(res.statusCode).toBe(400);
  });
});
