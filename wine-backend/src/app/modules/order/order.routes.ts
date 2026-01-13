// routes/order.routes.ts
import express from 'express';
import Auth from '../../../middleware/auth';
import * as OrderController from './order.controller'
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/createOrder', Auth(Role.CUSTOMER, Role.ADMIN), OrderController.createOrder);
router.get('/allOrder', Auth(Role.CUSTOMER), OrderController.allOrder);
router.get('/allOrderAdmin', Auth(Role.ADMIN), OrderController.allOrderAdmin);
router.get('/:id/details', Auth(Role.ADMIN), OrderController.orderDetails);
router.patch('/:id/status', Auth(Role.ADMIN), OrderController.updateStatus);



// router.get('/user', Auth(Role.CUSTOMER, Role.ADMIN), OrderController.getUserOrders);
// router.get('/:id', Auth(Role.CUSTOMER, Role.ADMIN), OrderController.getOrder);
// router.delete('/:id/cancel', Auth(Role.CUSTOMER, Role.ADMIN), OrderController.cancelOrder);
// router.get('/:orderId/payment-status', Auth(Role.CUSTOMER, Role.ADMIN), OrderController.getPaymentStatus);

export const OrderRoutes = router;
