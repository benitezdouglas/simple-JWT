const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');

const factory = require('../utils/factories');

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should authenticate with valid credentials", async () => {  
    const user = await factory.create('User');
  
    const response = await request(app)
      .post("/sessions") 
      .send({
        email: user.email,
        password: user.password
      });

     expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid password', async () => {
    const user = await factory.create('User');
  
    const response = await request(app)
      .post("/sessions") 
      .send({
        email: user.email,
        password: '1234'
      });

     expect(response.status).toBe(401);
  });

  it('should not authenticate with invalid email', async () => {
    const user = await factory.create('User');
  
    const response = await request(app)
      .post("/sessions") 
      .send({
        email: 'error@gmail.com',
        password: user.password
      });

     expect(response.status).toBe(401);
  });

  it('should return JTW token when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123'
    });
  
    console.log(user);

    const response = await request(app)
      .post("/sessions") 
      .send({
        email: user.email,
        password: user.password
      });

     expect(response.body).toHaveProperty("token");
  });

  it('shoud be able to acess private routes when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123'
    });
  
    console.log(user);

    const response = await request(app)
      .get("/dashboard") 
      .set("Authorization", `Bearer ${user.generateToken()}`);

     expect(response.status).toBe(200);
  });

  it('shoud not be able to acess private routes without JWT token ', async () => {
    const user = await factory.create('User', {
      password: '123'
    });
  
    console.log(user);

    const response = await request(app).get("/dashboard");

     expect(response.status).toBe(401);
  });

  it('shoud not be able to acess private routes with JWT token ', async () => {
    const user = await factory.create('User', {
      password: '123'
    });
  
    console.log(user);

    const response = await request(app)
      .get("/dashboard") 
      .set("Authorization", `Bearer 123123`);

     expect(response.status).toBe(401);
  });
});