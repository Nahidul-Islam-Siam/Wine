import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { filenamesToUrls } from "../../../helpers/files/utils/file-url.utils";

export const create = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.headers.id as string;
    const parsedBody = JSON.parse(req.body.data);

    const imageFiles = req.files && (req.files as any)["images"];
    const images = imageFiles ? imageFiles.map((file: any) => file.filename) : [];

    const result = await ProductService.create(adminId, { ...parsedBody, images: filenamesToUrls(images) });
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        status: true,
        message: "New product added!",
        data: result,
    });
});

export const update = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.headers.id as string;
    const id = req.params.id as string;
    const parsedBody = JSON.parse(req.body.data);

    const imageFiles = req.files && (req.files as any)["images"];
    const images = imageFiles ? imageFiles.map((file: any) => file.filename) : []; 

    const result = await ProductService.update(id, adminId, { ...parsedBody, images: filenamesToUrls(images) });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Product updated successfully!",
        data: result,
    });
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.getAll(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Product List Found",
        data: result,
    });
});

export const getAllByAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.getAllByAdmin(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Product List Found for admin",
        data: result,
    });
});

export const get = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.get(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Product Found",
        data: result,
    });
});


export const remove = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const adminId = req.headers.id as string;
    const result = await ProductService.remove(id, adminId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Product deleted success.",
        data: result,
    });
});

