import {PassportStrategy} from "@nestjs/passport";
import {Strategy, VerifyCallback} from 'passport-google-oauth20'
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_SECRET'),
      callbackURL: configService.get('CALLBACK_URL'),
      scope: ['profile', 'email']
    })
  }

  authorizationParams(): { [key: string]: string; } {
    return ({
      access_type: 'offline'
    })
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { emails, displayName } = profile
    const user = {
      email: emails[0].value,
      username: displayName
    }
    done(null, user);
  }


}