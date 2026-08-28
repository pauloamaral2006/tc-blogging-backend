import type { Request, Response } from "express";
import type AuthService from "./auth.service.js";
import { AppAuthNegate } from "../../erros/autth.js";
import type UserService from "../user/user.service.js";

class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async login(req: Request, res: Response): Promise<Response> {
    const { login, password } = req.body;

    const data = await this.authService.login(login, password);

    if (!data?.accessToken) {
      throw new AppAuthNegate("Invalid credentials");
    }

    return res.status(200).json({
      message: "Login successful",
      data: {
        accessToken: data.accessToken,
        user: data.user,
      },
    });
  }
}

export default AuthController;
