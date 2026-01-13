import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import { filenameToUrl } from "../../../helpers/files/utils/file-url.utils";

export const getProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.body.userId || req.headers.id as string;
    const result = await UserService.getProfile(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "User Profile Found",
        data: result,
    });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.headers.id as string;
    let imageFile;
    if (req.file) {
        imageFile = req.file.filename as string;
    }
    const parsedbody = JSON.parse(req.body.data)
    const result = await UserService.updateProfile(userId, parsedbody, filenameToUrl(imageFile));
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Profile updated successfully!",
        data: result,
    });
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
    const userId = req.headers.id as string
    const result = await UserService.changePassword(userId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "Password Changed!",
        data: result,
    });
});

export const userList = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.headers.id as string
    const result = await UserService.userList(adminId, req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        status: true,
        message: "User List Found!",
        data: result,
    });
});