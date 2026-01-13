import { Router } from "express";
import * as eventController from "./event.controller"
import validateRequest from "../../../middleware/validateRequest";
import { Role } from "@prisma/client";
import Auth from "../../../middleware/auth";
import upload from "../../../helpers/files/multer";
import { EventValidation } from "./evnet.validation";


const router = Router()

const imageUpload = upload.fields([
    { name: "images", maxCount: 20 },
])

router.post("/", Auth(Role.ADMIN), imageUpload,
    validateRequest(EventValidation.createEventValidationSchema), eventController.create
)

router.patch("/:id", Auth(Role.ADMIN), imageUpload,
    validateRequest(EventValidation.updateEventValidationSchema), eventController.update
)

router.get("/", Auth(Role.CUSTOMER, Role.ADMIN), eventController.getAll)

// router.get("/getAllByAdmin", Auth(Role.ADMIN), eventController.getAllByAdmin)

router.get("/:id", eventController.get)
router.delete("/:id", Auth(Role.ADMIN), eventController.remove)



// ========Event Booking========

router.post('/booking/create-booking', Auth(Role.CUSTOMER, Role.ADMIN),
    eventController.createEventBookingWithPayment
);
router.get('/booking/all', Auth(Role.CUSTOMER, Role.ADMIN), eventController.allBookingsByCustomer);
router.get('/booking/allForAdmin', Auth(Role.ADMIN), eventController.allBookingsByAdmin);

router.get('/booking/:bookingId', Auth(Role.CUSTOMER, Role.ADMIN), eventController.getBookingDetails);





export const EventRoutes = router;
