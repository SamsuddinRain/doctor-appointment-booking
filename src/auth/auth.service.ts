import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Create a local (email-based) user.
   * This is used by the signup endpoint so that users created via
   * email signup can also sign in without going through Google OAuth.
   */
  async createLocalUser(params: {
    email: string;
    name?: string;
    role: 'doctor' | 'patient';
  }): Promise<User> {
    const { email, name, role } = params;

    const existing = await this.findByEmail(email);
    if (existing) {
      return existing;
    }

    const user = this.usersRepo.create({
      email,
      name,
      role: role === 'doctor' ? UserRole.DOCTOR : UserRole.PATIENT,
    });

    await this.usersRepo.save(user);
    this.logger.log(`Created new local user ${email} (${user.id})`);
    return user;
  }

  async findByGoogleId(googleId: string) {
    return this.usersRepo.findOne({ where: { googleId } });
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findOrCreateFromGoogle(profile: any, role?: string) {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;
    const photo = profile.photos?.[0]?.value;

    let user = await this.findByGoogleId(googleId);
    if (!user && email) {
      user = await this.findByEmail(email);
    }

    if (!user) {
      user = this.usersRepo.create({
        googleId,
        email,
        name,
        photo,
        role: role === 'doctor' ? UserRole.DOCTOR : UserRole.PATIENT,
      });
      await this.usersRepo.save(user);
      this.logger.log(`Created new user ${email} (${user.id})`);
      return user;
    }

    // Update missing fields
    let updated = false;
    if (!user.googleId && googleId) {
      user.googleId = googleId;
      updated = true;
    }
    if (!user.name && name) {
      user.name = name;
      updated = true;
    }
    if (!user.photo && photo) {
      user.photo = photo;
      updated = true;
    }
    if (
      role &&
      user.role !== (role === 'doctor' ? UserRole.DOCTOR : UserRole.PATIENT)
    ) {
      user.role = role === 'doctor' ? UserRole.DOCTOR : UserRole.PATIENT;
      updated = true;
    }
    if (updated) await this.usersRepo.save(user);
    return user;
  }

  validateGoogleUser(profile: any) {
    return this.findOrCreateFromGoogle(profile);
  }

  login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
