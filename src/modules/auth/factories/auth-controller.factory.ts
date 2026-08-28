import UserRepository from "../../user/user.repository.js";
import UserService from "../../user/user.service.js";
import AuthController from "../auth.controller.js";
import AuthService from "../auth.service.js";

class AuthControllerFactory {
  static create() {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const authService = new AuthService(userService);
    return new AuthController(authService, userService);
  }
}

export default AuthControllerFactory;
