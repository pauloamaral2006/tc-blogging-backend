import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import type UserService from "../user/user.service.js";
import type { User } from "../user/user.entity.js";
import type { IUser } from "../user/interfaces/user.interface.js";
import { AppRegraNegocio } from "../../erros/regra-negocio.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(
    login: string,
    password: string,
  ): Promise<{ accessToken: string; user: User } | null> {
    if (!login || !password) {
      throw new AppRegraNegocio("Login or Password invalid.");
    }

    const user: IUser | null = await this.userService.getUserByLogin(login);

    if (!user) {
      throw new AppRegraNegocio("Login or Password invalid.");
    }

    if (user.isActive == false) {
      throw new AppRegraNegocio(
        "Account inactive. Please contact your administrator.",
      );
    }

    const doestPassword = await compare(password ?? "", user.password);

    if (!doestPassword) {
      throw new AppRegraNegocio("Login or Password invalid.");
    }

    const payload = {
      sub: user.id,
      role: user.role,
    };

    return {
      accessToken: jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" }),
      user: user,
    };
  }
}

export default AuthService;
