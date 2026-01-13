import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import httpStatus from "http-status"
import { OrderService } from "./order.service";
import sendResponse from "../../shared/sendResponse";
import { PaymentService } from "../payment/payment.service";

export const createOrder = catchAsync(async (req: Request, res: Response) => {
    const userId = req.headers.id as string;
    const { shippingDetails, paymentMethod } = req.body;


    const result = await OrderService.createOrderFromCart(userId, shippingDetails, paymentMethod);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        status: true,
        message: "Order created successfully",
        data: result,
    });
});

export const allOrder = catchAsync(async (req: Request, res: Response) => {
    const userId = req.headers.id as string;

    const result = await OrderService.allOrder(userId, req);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        status: true,
        message: "All Order Found successfully",
        data: result,
    });
});

export const allOrderAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.headers.id as string;

    const result = await OrderService.allOrderAdmin(adminId, req);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        status: true,
        message: "All Order Found successfully",
        data: result,
    });
});

export const orderDetails = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.headers.id as string;
    const { id } = req.params;
    const result = await OrderService.orderDetails(adminId, id);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        status: true,
        message: "Order details found",
        data: result,
    });
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.headers.id as string;
    const { id } = req.params;
    const parseBody = req.body;
    const result = await OrderService.updateStatus(adminId, id, parseBody);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        status: true,
        message: "Order status updated",
        data: result,
    });
});




// export const getOrder = catchAsync(async (req: Request, res: Response) => {
//     const userId = req.headers.id as string;
//     const { id } = req.params;

//     const result = await OrderService.getOrder(id, userId);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         status: true,
//         message: "Order found",
//         data: result,
//     });
// });

// export const getUserOrders = catchAsync(async (req: Request, res: Response) => {
//     const userId = req.headers.id as string;
//     const { page = '1', limit = '10' } = req.query;

//     const result = await OrderService.getUserOrders(
//         userId,
//         parseInt(page as string),
//         parseInt(limit as string)
//     );

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         status: true,
//         message: "Orders found",
//         data: result,
//     });
// });

// export const cancelOrder = catchAsync(async (req: Request, res: Response) => {
//     const userId = req.headers.id as string;
//     const { id } = req.params;

//     const result = await OrderService.cancelOrder(id, userId);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         status: true,
//         message: "Order cancelled successfully",
//         data: result,
//     });
// });

// export const getPaymentStatus = catchAsync(async (req: Request, res: Response) => {
//     const userId = req.headers.id as string;
//     const { orderId } = req.params;

//     const result = await PaymentService.getPaymentStatus(orderId, userId);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         status: true,
//         message: "Payment status found",
//         data: result,
//     });
// });