import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from '../common/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signUpDto: SignUpDto) {
    const existingUser = await this.authService.findByEmail(signUpDto.email);
    if (existingUser) {
      return {
        statusCode: 409,
        message: 'User already exists',
      };
    }

    // Create a local user so that email-based signin works
    await this.authService.createLocalUser({
      email: signUpDto.email,
      name: signUpDto.name,
      role: signUpDto.role,
    });

    return {
      statusCode: 201,
      message: 'Sign up successful. Please complete authentication via Google.',
      data: {
        email: signUpDto.email,
        role: signUpDto.role,
      },
    };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() signInDto: SignInDto) {
    const user = await this.authService.findByEmail(signInDto.email);
    if (!user) {
      return {
        statusCode: 401,
        message: 'User not found. Please sign up first.',
      };
    }

    const result = this.authService.login(user);
    return {
      statusCode: 200,
      message: 'Sign in successful',
      data: result,
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Request() req: any) {
    if (!req.user) {
      return { message: 'Google authentication failed' };
    }
    const result = this.authService.login(req.user);
    return {
      statusCode: 200,
      message: 'Google sign in successful',
      data: result,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@Request() req: any) {
    const user = await this.authService.findById(req.user.userId);
    if (!user) {
      return { statusCode: 404, message: 'User not found' };
    }
    return {
      statusCode: 200,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        photo: user.photo,
      },
    };
  }
}
