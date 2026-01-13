import { Router } from "express";
import * as SizeController from "./size.controller"
import { Role } from "@prisma/client";
import Auth from "../../../middleware/auth";


const router = Router()


router.post("/", Auth(Role.ADMIN), SizeController.create)

router.patch("/:id", Auth(Role.ADMIN), SizeController.update)

router.get("/", Auth(Role.CUSTOMER, Role.ADMIN), SizeController.getAll)
router.get("/:id", Auth(Role.CUSTOMER, Role.ADMIN), SizeController.getSize)
router.delete("/:id", Auth(Role.ADMIN), SizeController.deleteSize)

export const SizeRoutes = router;
