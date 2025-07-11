import { Test } from '@nestjs/testing';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthService } from '../../../src/auth/auth.service';
import { SignInDto } from '../../../src/auth/dto/sign-in.dto';
import { BcryptService } from '../../../src/auth/bcrypt.service';
import { RedisService } from '../../../src/redis/redis.service';
import jwtConfig from '../../../src/common/config/jwt.config';
import { User } from '../../../src/users/entities/user.entity';
import { MysqlErrorCode } from '../../../src/common/enums/error-codes.enum';
import { ActiveUserData } from '../../../src/common/interfaces/active-user-data.interface';

describe('AuthService', () => {
  let authService: AuthService;
  let bcryptService: BcryptService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let redisService: RedisService;
  let jwtConfiguration: ConfigType<typeof jwtConfig>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: BcryptService, useValue: createMock<BcryptService>() },
        { provide: JwtService, useValue: createMock<JwtService>() },
        { provide: RedisService, useValue: createMock<RedisService>() },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: jwtConfig.KEY,
          useValue: jwtConfig.asProvider(),
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    bcryptService = moduleRef.get<BcryptService>(BcryptService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    redisService = moduleRef.get<RedisService>(RedisService);
    jwtConfiguration = moduleRef.get<ConfigType<typeof jwtConfig>>(
      jwtConfig.KEY,
    );
  });

  describe('signUp', () => {
    const signUpDto: SignInDto = {
      username: 'test@example.com',
    };
    let user: User;

    beforeEach(() => {
      user = new User();
      user.username = signUpDto.username;
    });

    it('should create a new user', async () => {
      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValueOnce(user);
      await authService.signUp(signUpDto);
      expect(saveSpy).toHaveBeenCalledWith(user);
    });

    it('should throw a ConflictException if a user with the same username already exists', async () => {
      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockRejectedValueOnce({ code: MysqlErrorCode.UniqueViolation });

      await expect(authService.signUp(signUpDto)).rejects.toThrowError(
        new ConflictException(`User [${signUpDto.username}] already exist`),
      );

      expect(saveSpy).toHaveBeenCalledWith(user);
    });

    it('should rethrow any other error that occurs during signup', async () => {
      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockRejectedValueOnce(new Error('Unexpected error'));

      await expect(authService.signUp(signUpDto)).rejects.toThrowError(
        new Error('Unexpected error'),
      );

      expect(saveSpy).toHaveBeenCalledWith(user);
    });
  });

  describe('signIn', () => {
    it('should sign in a user and return an access token', async () => {
      const signInDto = {
        username: 'johndoe001',
      };

      const user = new User();
      user.id = 123;
      user.username = signInDto.username;

      const tokenId = expect.any(String);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(authService, 'generateAccessToken')
        .mockResolvedValue({ accessToken: 'accessToken' });

      const result = await authService.signIn(signInDto);

      expect(result).toEqual({ accessToken: 'accessToken' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: signInDto.username },
      });
    });

    it('should throw an error when username is invalid', async () => {
      const signInDto = {
        username: 'invalid-username',
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(authService.signIn(signInDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: signInDto.username },
      });
    });
  });

  describe('signOut', () => {
    it('should delete user token from Redis', async () => {
      const userId = 1;
      const deleteSpy = jest
        .spyOn(redisService, 'delete')
        .mockResolvedValue(undefined);

      await authService.signOut(userId);

      expect(deleteSpy).toHaveBeenCalledWith(`user-${userId}`);
    });
  });

  describe('generateAccessToken', () => {
    it('should insert a token into Redis and return an access token', async () => {
      const user = { id: 123, username: 'testexample' };
      const tokenId = expect.any(String);
      const accessToken = 'test-access-token';
      (redisService.insert as any).mockResolvedValueOnce(undefined);
      (jwtService.signAsync as any).mockResolvedValueOnce(accessToken);

      const result = await authService.generateAccessToken(user);

      expect(redisService.insert).toHaveBeenCalledWith(
        `user-${user.id}`,
        tokenId,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: user.id, username: user.username, tokenId } as ActiveUserData,
        {
          secret: jwtConfiguration.secret,
          expiresIn: jwtConfiguration.accessTokenTtl,
        },
      );
      expect(result).toEqual({ accessToken });
    });
  });
});
