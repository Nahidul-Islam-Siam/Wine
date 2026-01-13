import { Router } from "express";
import * as OurStoryController from "./ourStory.controller"
// import { UserValidation } from "./user.validation";
import { Role } from "@prisma/client";
import upload from "../../../../helpers/files/multer";
import Auth from "../../../../middleware/auth";
import { OurStoryValidation } from "./ourStory.validation";
import validateRequest from "../../../../middleware/validateRequest";



const router = Router()


router.post("/", Auth(Role.ADMIN), upload.single("image"),
    validateRequest(OurStoryValidation.updateOurStoryValidationSchema), OurStoryController.updateStory)

router.get("/", OurStoryController.getStory)
router.delete("/", Auth(Role.ADMIN), OurStoryController.deleteStory)

export const OurStoryRoutes = router;
