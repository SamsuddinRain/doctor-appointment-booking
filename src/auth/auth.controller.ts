import { Controller, Get, Req, Res, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private config: ConfigService) {}

  @Get('google')
  async googleAuth(@Res() res: Response) {
    const clientID = this.config.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.config.get<string>('GOOGLE_CLIENT_SECRET');
    if (!clientID || !clientSecret) {
      throw new HttpException('Google OAuth not configured', HttpStatus.SERVICE_UNAVAILABLE);
    }
    // If configured, redirect to the passport strategy route which will be handled
    // by the registered Google Passport strategy.
    return res.redirect('/auth/google');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const user: any = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      const token = this.authService.login(user);
      // set httpOnly cookie
      res.cookie('jid', token.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const redirect = this.config.get<string>('CLIENT_REDIRECT_URL') ?? 'http://localhost:3000/auth/success';
      return res.redirect(redirect);
    } catch (err) {
      // avoid leaking internal errors to clients
      // log and return a safe error response
      // eslint-disable-next-line no-console
      console.error('OAuth callback error', err);
      return res.status(500).json({ message: 'OAuth callback error' });
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request) {
    return (req as any).user;
  }
}
