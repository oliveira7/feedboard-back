import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async login(user: any) {
    if (!user.email || !user._id) {
      throw new UnauthorizedException('User data is missing');
    }

    const payload = { email: user.email, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createInvitationToken(email: string): Promise<string> {
    return this.jwtService.sign({ email }, { expiresIn: '7d' });
  }
}
