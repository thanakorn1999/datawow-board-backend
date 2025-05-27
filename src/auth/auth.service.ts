import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

import jwtConfig from '../common/config/jwt.config';
import { MysqlErrorCode } from '../common/enums/error-codes.enum';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';
import { RedisService } from '../redis/redis.service';
import { User } from '../users/entities/user.entity';
import { BcryptService } from './bcrypt.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async signUp(signInDto: SignInDto): Promise<void> {
    try {
      const user = new User();
      user.username = signInDto.username;
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === MysqlErrorCode.UniqueViolation) {
        throw new ConflictException(
          `User [${signInDto.username}] already exist`,
        );
      }
      throw error;
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { username } = signInDto;

    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid username');
    }

    return await this.generateAccessToken(user);
  }
  // async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
  //   const { username } = signInDto;
  //   let user: Partial<User>;
  //   user = await this.userRepository.findOne({
  //     where: {
  //       username,
  //     },
  //   });
  //   if (!user) {
  //     // ? automate register
  //     await this.signUp({ username });
  //     user = await this.userRepository.findOne({
  //       where: {
  //         username,
  //       },
  //     });
  //   }
  //   if (!user) {
  //     throw new Error('');
  //   }
  //   return await this.generateAccessToken(user);
  // }
  async signOut(userId: number): Promise<void> {
    this.redisService.delete(`user-${userId}`);
  }

  async generateAccessToken(
    user: Partial<User>,
  ): Promise<{ accessToken: string }> {
    const tokenId = randomUUID();

    await this.redisService.insert(`user-${user.id}`, tokenId);

    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        username: user.username,
        tokenId,
      } as ActiveUserData,
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );

    return { accessToken };
  }
}
