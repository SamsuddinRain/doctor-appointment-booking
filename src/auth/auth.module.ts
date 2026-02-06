import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategyLib } from 'passport-google-oauth20';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'change_this_secret',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    // Google strategy instantiated via factory. The factory will only instantiate
    // the real Passport strategy when the required env vars are present. Instantiating
    // the strategy registers it with Passport; when env vars are missing we return
    // null so the application doesn't crash at startup.
    {
      provide: 'GOOGLE_STRATEGY',
      useFactory: (config: ConfigService, authService: AuthService) => {
        const clientID = config.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET');
        const callbackURL = config.get<string>('GOOGLE_CALLBACK_URL') ?? 'http://localhost:3000/auth/google/callback';
        if (!clientID || !clientSecret) {
          // Do not instantiate strategy when config is missing.
          // This avoids passport throwing "requires clientID" errors.
          // Logging via console is acceptable here for visibility.
          // eslint-disable-next-line no-console
          console.warn('Google OAuth not configured: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET missing.');
          return null;
        }

        class DynamicGoogleStrategy extends PassportStrategy(GoogleStrategyLib, 'google') {
          constructor() {
            super({
              clientID,
              clientSecret,
              callbackURL,
              scope: ['profile', 'email'],
              passReqToCallback: true,
            });
          }

          async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: Function) {
            try {
              const role = (req.query && (req.query as any).role) || 'patient';
              const user = await authService.findOrCreateFromGoogle(profile, role as string);
              done(null, user);
            } catch (err) {
              done(err, false);
            }
          }
        }

        // instantiating registers the strategy with passport
        return new DynamicGoogleStrategy();
      },
      inject: [ConfigService, AuthService],
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
