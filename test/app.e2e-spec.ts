import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { ResponseInterceptor } from './../src/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

 beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  it('/ (GET)', () => {
  return request(app.getHttpServer())
    .get('/')
    .expect(200)
    .then((response) => {
      expect(response.body.data).toBe('Hello World!');
    });
});

  describe('/tasks (e2e)', () => {
    let createdTaskId: number;
    let userToken: string;
    let adminToken: string;

    beforeEach(async () => {
      const userLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'mypassword123' });
      userToken = userLogin.body.data.access_token;

      const adminLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: 'adminpass123' });
      adminToken = adminLogin.body.data.access_token;
    });

    it('/tasks (POST) - should create a task', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Test task', description: 'Created by e2e test' })
        .expect(201)
        .then((response) => {
          expect(response.body.data).toHaveProperty('id');
          expect(response.body.data.title).toBe('Test task');
          createdTaskId = response.body.data.id;
        });
    });

    it('/tasks (GET) - should return an array of tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    it('/tasks/:id (PATCH) - should update a task', async () => {
      const created = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Task to update', description: 'For PATCH test' });

      const taskId = created.body.data.id;

      return request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({ completed: true })
        .expect(200)
        .then((response) => {
          expect(response.body.data.completed).toBe(true);
        });
    });

    it('/tasks/:id (DELETE) - should delete a task', async () => {
      const created = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Task to delete', description: 'For DELETE test' });

      const taskId = created.body.data.id;

      return request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});