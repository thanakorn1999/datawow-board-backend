import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBadRequestResponse({
    description: 'Return errors for invalid sign in fields',
  })
  @ApiOkResponse({ description: 'User has been successfully signed in' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    let token: { accessToken: string };
    try {
      token = await this.authService.signIn(signInDto);
    } catch (error) {
      await this.authService.signUp(signInDto);
      token = await this.authService.signIn(signInDto);
    }
    return token;
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ description: 'User has been successfully signed out' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  signOut(@ActiveUser('id') userId: number): Promise<void> {
    return this.authService.signOut(userId);
  }
}
