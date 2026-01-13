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
    const createCategory = await prisma.category.create({
        data: payload
    })
    return createCategory;
};

const updateCategory = async (
    categoryId: string,
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
    const categoryExist = await prisma.category.findUnique({
        where: { id: categoryId }
    });
    if (!categoryExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found!");
    }

    // Handle image upload
    if (payload.img && categoryExist.img) {
        deleteFiles([urlToFilename(categoryExist.img)])
    }

    const updatedCategory = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: payload
    })
    return { updatedCategory };
};

const getAll = async () => {
    const category = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            des: true,
            img: true
        }
    });
    if (!category.length) {
        throw new ApiError(httpStatus.NOT_FOUND, "No category is available");
    }
    return { total: category.length, category };
};

const getCategory = async (id: string) => {
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, " Category Id is required!")
    const category = await prisma.category.findUnique({
        where: {
            id
        }
    });
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, "No category found with this id");
    }
    return category;
};

const deleteCategory = async (id: string, adminId: string) => {

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

    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, " Category Id is required!")
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            products:true
        }
    });
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, "No category found with this id");
    }
    if (category.products.length) {
        throw new ApiError(httpStatus.NOT_FOUND, "Cannot delete category with existing products.");
    }

    deleteFiles([urlToFilename(category.img)]);

    const removeCategory = await prisma.category.delete({
        where: {
            id
        }
    })
    return removeCategory;
};


export const CategoryService = {
    create,
    getAll,
    updateCategory,
    getCategory,
    deleteCategory
};
