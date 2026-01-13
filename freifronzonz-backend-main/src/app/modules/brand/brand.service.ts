import prisma from "../../../config/db.prisma";
import { ApiError } from "../../../errors/apiError";
import httpStatus from "http-status";

import { deleteFiles } from "../../../helpers/files/fileDelete";
import { urlToFilename } from "../../../helpers/files/utils/file-url.utils";

const create = async (
    adminId: string,
    payload: {
        name: string;
        des?: string;
        img: string | any
    },
) => {
    if (!adminId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Admin ID is missing!");
    }
    const adminExist = await prisma.user.findUnique({
        where: { id: adminId },
        include: { profile: true },
    });
    if (!adminExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Admin not found!");
    }
    if (!payload.img) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Brand Image is required!");
    }
    const createBrand = await prisma.brand.create({
        data: payload
    })
    return createBrand;
};

const updateBrand = async (
    brandId: string,
    adminId: string,
    payload: {
        name?: string;
        des?: string;
        img?: string | any
    },
) => {
    if (!adminId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User ID is missing!");
    }

    // Check if user exists
    const userExist = await prisma.user.findUnique({
        where: { id: adminId },
        include: { profile: true },
    });
    if (!userExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
    }

    // Check if user exists
    const brandExist = await prisma.brand.findUnique({
        where: { id: brandId }
    });
    if (!brandExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Brand not found!");
    }

    // Handle image upload
    if (payload.img && brandExist.img) {
        deleteFiles([urlToFilename(brandExist.img)])
    }

    const updatedBrand = await prisma.brand.update({
        where: {
            id: brandId
        },
        data: payload
    })
    return { updatedBrand };
};

const getAll = async () => {
    const brand = await prisma.brand.findMany({
        select: {
            id: true,
            name: true,
            des: true,
            img: true
        }
    });
    if (!brand.length) {
        throw new ApiError(httpStatus.NOT_FOUND, "No brand is available");
    }
    return { total: brand.length, brand };
};

const getbrand = async (id: string) => {
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, " Brand Id is required!")
    const brand = await prisma.brand.findUnique({
        where: {
            id
        }
    });
    if (!brand) {
        throw new ApiError(httpStatus.NOT_FOUND, "No brand found with this id");
    }
    return brand;
};

const deleteBrand = async (id: string, adminId: string) => {

    if (!adminId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Admin ID is missing!");
    }
    const adminExist = await prisma.user.findUnique({
        where: { id: adminId },
        include: { profile: true },
    });
    if (!adminExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Admin not found!");
    }

    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, " Brand Id is required!")
    const brand = await prisma.brand.findUnique({
        where: { id },
        include: {
            products: true
        }
    });

    if (!brand) {
        throw new ApiError(httpStatus.NOT_FOUND, "No brand found with this id");
    }
    if (brand.products.length) {
        throw new ApiError(httpStatus.NOT_FOUND, "Cannot delete brand with existing products.");
    }

    deleteFiles([urlToFilename(brand.img)]);
    const removeBrand = await prisma.brand.delete({
        where: {
            id
        }
    })
    return removeBrand;
};




export const BrandService = {
    create,
    getAll,
    updateBrand,
    getbrand,
    deleteBrand
};
