import { Router } from "express";
import * as ProductController from "./product.controller"
import validateRequest from "../../../middleware/validateRequest";
import { Role } from "@prisma/client";
import Auth from "../../../middleware/auth";
import upload from "../../../helpers/files/multer";
import { ProductValidation } from "./product.validation";


const router = Router()

const imageUpload = upload.fields([
    { name: "images", maxCount: 20 },
])

router.post("/", Auth(Role.ADMIN), imageUpload,
    validateRequest(ProductValidation.createProductValidationSchema), ProductController.create)

router.patch("/:id", Auth(Role.ADMIN), imageUpload,
    validateRequest(ProductValidation.updateProductValidationSchema), ProductController.update)

router.get("/", ProductController.getAll)

router.get("/getAllByAdmin", Auth(Role.ADMIN), ProductController.getAllByAdmin)

router.get("/:id", ProductController.get)

router.delete("/:id", Auth(Role.ADMIN), ProductController.remove)

export const ProductRoutes = router;
