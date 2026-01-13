import prisma from "../../../config/db.prisma";
import { ApiError } from "../../../errors/apiError";
import httpStatus from "http-status";

const create = async (
    userId: string,
    payload: {
        rating: number;
        des?: string;
        orderId: string;
        productId: string;
    },
) => {
    if (!userId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User ID is missing!");
    }
    const userExist = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!userExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
    }

    const orderExist = await prisma.order.findUnique({
        where: { id: payload.orderId },
    });
    if (!orderExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Order not found!");
    }

    const productExist = await prisma.product.findUnique({
        where: { id: payload.productId },
    });
    if (!productExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found or not available!");
    }
    const orderProductExist = await prisma.orderProduct.findFirst({
        where: {
            orderId: payload.orderId
        },
    });
    if (!orderProductExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "This product is not in your order!");
    }
    if (orderProductExist.isReviewed) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You have already reviewed this product!");
    }


    const createReview = await prisma.review.create({
        data: {
            ...payload,
            userId
        }
    })
    return createReview;
};

const approveReview = async (
    id: string,
    adminId: string
) => {
    if (!adminId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User ID is missing!");
    }

    // Check if user exists
    const userExist = await prisma.user.findUnique({
        where: { id: adminId },
    });
    if (!userExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
    }

    const reviewExist = await prisma.review.findUnique({
        where: { id },
    });
    if (!reviewExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Review not found!");
    }
    if (reviewExist.isApproved) {
        throw new ApiError(httpStatus.OK, "Review already approved!");
    }

    const approve = await prisma.review.update({
        where: {
            id
        },
        data: {
            isApproved: true,
        }
    })
    return { approve };
};

const isReviewed = async (
    productId: string,
    userId: string
) => {
    if (!userId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User ID is missing!");
    }

    // Check if user exists
    const userExist = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!userExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
    }

    const reviewExist = await prisma.review.findFirst({
        where: { productId, userId },
    });
    if (!reviewExist) {
        return { isReviewed: false };
    }

    return { isReviewed: true };
};

const getAllApproved = async (productId) => {
    const productReview = await prisma.review.findMany({
        where: {
            productId,
            isApproved: true
        }
    });
    if (!productReview.length) {
        throw new ApiError(httpStatus.NOT_FOUND, "No review is available for this product");
    }
    return { total: productReview.length, productReview };
};

const getAll = async () => {
    const productReview = await prisma.review.findMany();
    if (!productReview.length) {
        throw new ApiError(httpStatus.NOT_FOUND, "No review is available right now");
    }
    return { total: productReview.length, productReview };
};

const getReview = async (id: string) => {
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "Review Id is required!")
    const review = await prisma.review.findUnique({
        where: {
            id
        }
    });
    if (!review) {
        throw new ApiError(httpStatus.NOT_FOUND, "No review found with this id");
    }
    return review;
};

const deleteReview = async (id: string, adminId: string) => {

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

    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "Review Id is required!")
    const reviewExist = await prisma.review.findUnique({
        where: { id },
    });

    if (!reviewExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "No review found with this id");
    }


    const removeReview = await prisma.review.delete({
        where: {
            id
        }
    })
    return removeReview;
};




export const ReviewService = {
    create,
    getAllApproved,
    getAll,
    approveReview,
    isReviewed,
    getReview,
    deleteReview
};
