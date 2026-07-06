import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
  describe('/tasks (e2e)', () => {
  let createdTaskId: number;

  it('/tasks (POST) - should create a task', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Test task', description: 'Created by e2e test' })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test task');
        createdTaskId = response.body.id;
      });
  });

  it('/tasks (GET) - should return an array of tasks', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });
  it('/tasks/:id (PATCH) - should update a task', () => {
  return request(app.getHttpServer())
    .patch(`/tasks/${createdTaskId}`)
    .send({ completed: true })
    .expect(200)
    .then((response) => {
      expect(response.body.completed).toBe(true);
    });
});

it('/tasks/:id (DELETE) - should delete a task', () => {
  return request(app.getHttpServer())
    .delete(`/tasks/${createdTaskId}`)
    .expect(200);
});
});
});
