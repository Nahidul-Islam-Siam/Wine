import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { EventService } from "./evnet.service";
import { filenamesToUrls } from "../../../helpers/files/utils/file-url.utils";

export const create = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.headers.id as string;
    const parsedBody = JSON.parse(req.body.data);

    const imageFiles = req.files && (req.files as any)["images"];
    const images = imageFiles ? imageFiles.map((file: any) => file.filename) : [];

    const result = await EventService.create(adminId, { ...parsedBody, images: filenamesToUrls(images) });
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        status: true,
        message: "New event added!",
        data: result,
    });
});

export const update = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.headers.id as string;
    const id = req.params.id as string;
    const parsedBody = JSON.parse(req.body.data);

    const imageFiles = req.files && (req.files as any)["images"];
    const images = imageFiles ? imageFiles.map((file: any) => file.filename) : [];

    const result = await EventService.update(id, adminId, { ...parsedBody, images: filenamesToUrls(images) });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Event updated successfully!",
        data: result,
    });
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.getAll(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Event List Found",
        data: result,
    });
});

// export const getAllByAdmin = catchAsync(async (req: Request, res: Response) => {
//     const result = await EventService.getAllByAdmin(req);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         status: true,
//         message: "Event List Found for admin",
//         data: result,
//     });
// });

export const get = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await EventService.get(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Event Found",
        data: result,
    });
});


export const remove = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const adminId = req.headers.id as string;
    const result = await EventService.remove(id, adminId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Event deleted success.",
        data: result,
    });
});



// ========Event Booking========

export const createEventBookingWithPayment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.body.userid || req.headers.id as string;
    const { eventId, paymentMethod, person } = req.body;

    const result = await EventService.createBookingWithPayment(
        userId,
        eventId,
        paymentMethod,
        { person }
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        status: true,
        message: "Event booking created successfully",
        data: result,
    });
});

export const getBookingDetails = catchAsync(async (req: Request, res: Response) => {
    const userId = req.body.userid || req.headers.id as string;
    const { bookingId } = req.params;

    const result = await EventService.getBookingById(bookingId, userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Event booking details fetched successfully",
        data: result,
    });
});

export const allBookingsByCustomer = catchAsync(async (req: Request, res: Response) => {
    const userId = req.body.userid || req.headers.id as string;
    const result = await EventService.allBookingsByCustomer(userId, req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Booking list found for customer",
        data: result,
    });
});

export const allBookingsByAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.allBookingsByAdmin(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "All Booking list found",
        data: result,
    });
});