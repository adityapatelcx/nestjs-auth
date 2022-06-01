/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { AuthCredentialsDto } from '../src/auth';
import { DatabaseService } from '../src/database';
import * as request from 'supertest';
import { Connection } from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    app.enableCors();

    await app.init();

    dbConnection = moduleFixture
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();

    await dbConnection.collection('users').deleteMany({});

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });

  describe('Auth', () => {
    const dtoOne: AuthCredentialsDto = {
      first_name: 'test1',
      last_name: 'elysium1',
      email: 'test1@elysium.com',
      password: 'elysium1',
      master_pin: null,
    };

    const dtoTwo: AuthCredentialsDto = {
      first_name: 'test2',
      last_name: 'elysium2',
      email: 'test2@elysium.com',
      password: 'elysium2',
      master_pin: null,
    };

    const dtoThree: AuthCredentialsDto = {
      first_name: 'test3',
      last_name: 'elysium3',
      email: 'test3@elysium.com',
      password: 'elysium3',
      master_pin: null,
    };

    const dtoFour: AuthCredentialsDto = {
      first_name: 'test4',
      last_name: 'elysium4',
      email: 'test4@elysium.com',
      password: 'elysium4',
      master_pin: null,
    };

    const dtoFive: AuthCredentialsDto = {
      first_name: 'test5',
      last_name: 'elysium5',
      email: 'test5@elysium.com',
      password: 'elysium5',
      master_pin: null,
    };

    describe('signup', () => {
      it('should throw error if email field is empty', async () => {
        const { email, ...data } = dtoOne;

        return request(httpServer).post('/auth/signup').send(data).expect(400);
      });

      it('should throw error if password field is empty (in case of local strategy)', async () => {
        const { password, ...data } = dtoOne;

        return request(httpServer).post('/auth/signup').send(data).expect(400);
      });

      it('should throw error if email field is not proper', async () => {
        const { ...data } = dtoOne;

        // improper email format
        data.email = 'test1@elysium';

        return request(httpServer).post('/auth/signup').send(data).expect(400);
      });

      it('should not throw error if the user is successfully register and receives access_token', async () => {
        const { ...data } = dtoOne;

        const response = await request(httpServer)
          .post('/auth/signup')
          .send(data)
          .expect(201);

        expect(response.body.message).toBe('User has been signed up');
        expect(response.body.access_token).toMatch(
          /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/,
        );
      });

      it('should throw error if user is already register', async () => {
        const { ...data } = dtoOne;

        return request(httpServer).post('/auth/signup').send(data).expect(409);
      });

      it('should not throw error if first_name field is empty', async () => {
        const { first_name, ...data } = dtoTwo;

        return request(httpServer).post('/auth/signup').send(data).expect(201);
      });

      it('should not throw error if last_name field is empty', async () => {
        const { last_name, ...data } = dtoThree;

        return request(httpServer).post('/auth/signup').send(data).expect(201);
      });

      it('should throw error if master pin length is less than 7', async () => {
        const { ...data } = dtoFour;

        // improper master_pin
        data.master_pin = 12;

        return request(httpServer).post('/auth/signup').send(data).expect(400);
      });

      it('should throw error if master pin length is more than 7', async () => {
        const { ...data } = dtoFour;

        // improper master_pin
        data.master_pin = 12345678;

        return request(httpServer).post('/auth/signup').send(data).expect(400);
      });

      it('should not throw error if master pin length is equal to 7', async () => {
        const { ...data } = dtoFour;

        // improper master_pin
        data.master_pin = 1234567;

        return request(httpServer).post('/auth/signup').send(data).expect(201);
      });
    });

    describe('signin', () => {
      it('should throw error if new user tries to signin', async () => {
        const { ...data } = dtoFive;

        return request(httpServer).post('/auth/signin').send(data).expect(404);
      });

      it('should not throw error if registered user tries to signin', async () => {
        const { ...data } = dtoOne;

        return request(httpServer).post('/auth/signin').send(data).expect(200);
      });

      it('should not throw error if the registered user tries to signin and receives access_token', async () => {
        const { ...data } = dtoOne;

        const response = await request(httpServer)
          .post('/auth/signin')
          .send(data)
          .expect(200);

        expect(response.body.message).toBe('User has been signed in');
        expect(response.body.access_token).toMatch(
          /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/,
        );
      });

      it('should throw error if the registered user tries to signin with incorrect email', async () => {
        const { ...data } = dtoOne;

        // set incorrect password
        data.password = 'elysium17';

        const response = await request(httpServer)
          .post('/auth/signin')
          .send(data)
          .expect(401);

        expect(response.body.message).toBe('Incorrect login credentials');
      });

      it('should throw error if the registered user tries to signin with incorrect email', async () => {
        const { ...data } = dtoOne;

        // set incorrect password
        data.email = 'test17@elysium.com';

        const response = await request(httpServer)
          .post('/auth/signin')
          .send(data)
          .expect(404);

        expect(response.body.message).toBe(
          'User not found, Please signup first',
        );
      });
    });
  });

  describe('Users', () => {
    const dtoSix: AuthCredentialsDto = {
      first_name: 'test6',
      last_name: 'elysium6',
      email: 'test6@elysium.com',
      password: 'elysium6',
      master_pin: null,
    };

    describe('if user is signed up as (USER)', () => {
      let access_token: any;

      beforeAll(async () => {
        const { ...data } = dtoSix;

        const response = await request(httpServer)
          .post('/auth/signup')
          .send(data)
          .expect(201);

        access_token = response.body.access_token;
      });

      it('should not throw error if the user signup first and then GET /users ', async () => {
        const res = await request(httpServer)
          .get('/users/')
          .set('Authorization', 'Bearer ' + access_token)
          .expect(200);
      });
    });

    describe('if user is signed in as (USER)', () => {
      let access_token: any;

      beforeAll(async () => {
        const { ...data } = dtoSix;

        const response = await request(httpServer)
          .post('/auth/signin')
          .send(data)
          .expect(200);

        access_token = response.body.access_token;
      });

      it('should not throw error if the user signin first and then GET /users ', async () => {
        const res = await request(httpServer)
          .get('/users/')
          .set('Authorization', 'Bearer ' + access_token)
          .expect(200);
      });
    });
  });
});
