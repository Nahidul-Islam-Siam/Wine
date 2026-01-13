import { Router } from "express";
import * as PaymentController from './payment.controller'

import Auth from "../../../middleware/auth";
import { Role } from "@prisma/client";
// import { PaymentWebhookController } from "../Paymentwebhook/paymentWebhook.controller";
const router = Router();

// router.post("/create-payment", Auth(Role.CUSTOMER, Role.ADMIN), PaymentController.createPaymentSession);


router.get("/history", Auth(Role.CUSTOMER, Role.ADMIN), PaymentController.history);
router.get("/adminHistory", Auth(Role.ADMIN), PaymentController.adminHistory);
router.get("/:id", Auth(Role.ADMIN), PaymentController.detais);

// router.get("/pending", auth(), PaymentController.getPendingPayments);


export const PaymentRoutes = router;
