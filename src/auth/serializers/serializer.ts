import {PassportSerializer} from "@nestjs/passport";
import {AuthService} from "../auth.service";
import {Injectable} from "@nestjs/common";
import {User} from "../../user/user.model";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private authService: AuthService
  ) {
    super();
  }

  serializeUser(user: User, done: Function): any {
    console.log('SERIALIZE USER')
    done(null, user)
  }

  async deserializeUser(payload: any, done: Function) {
    console.log(payload)
    const user = await this.authService.getUserById(payload._id)
    console.log('DESERIALIZE USER')
    return user ? done(null, user) : done(null, null)
  }
}