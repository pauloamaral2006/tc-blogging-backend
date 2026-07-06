import express from "express";
import UserControllerFactory from "./factories/user-controller.factory.js";
import {
  verifyAuth,
  verifyRole,
} from "../../middlewares/verify-auth.middleware.js";
import { UserRoleEnum } from "../../enum/user-role.enum.js";
import { createRouter } from "../router.js";

const routes = createRouter();

const userController = UserControllerFactory.create();

routes.use(verifyAuth);

routes.post("/", verifyRole(UserRoleEnum.ADMIN), userController.createUser.bind(userController));
routes.get("/", verifyRole(UserRoleEnum.ADMIN), userController.getAllUsers.bind(userController));
routes.get("/me", userController.getMe.bind(userController));
routes.put("/me", userController.editMe.bind(userController));
routes.delete("/me", userController.deleteMe.bind(userController));

export default routes;
