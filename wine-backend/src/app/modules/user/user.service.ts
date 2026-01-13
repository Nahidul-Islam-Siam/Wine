import { Request, response } from "express";
import prisma from "../../../config/db.prisma";
import { ApiError } from "../../../errors/apiError";
import httpStatus from "http-status";
import {
  comparePassword,
  hashPassword,
} from "../../../helpers/passwordCompare";
import { Prisma } from "@prisma/client";
import { deleteFiles } from "../../../helpers/files/fileDelete";
import { urlToFilename } from "../../../helpers/files/utils/file-url.utils";

const getProfile = async (userId: string) => {
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Id is missing!");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photo: true,
      lang: true,
      dob: true,
      role: true,
      lastLogin: true,
      profile: {
        select: {
          userId: true,
          fullName: true,
          bloodGroup: true,
          gender: true,
          address: true,
          country: true,
          intro: true,
        }
      },
      orders: {
        select: {
          id: true,
          orderNo: true,
          amount: true,
          status: true,
          currency: true,
          orderProducts: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                }
              }
            }
          }
        }
      },
      EventBooking: {
        select: {
          id: true,
          eventId: true,
          person: true,
          bookingDate: true,
          status: true,
          event: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
              status: true
            }
          },
          payment: {
            select: {
              id: true,
              name: true,
              paidAmount: true,
              status: true
            }
          }
        }
      }
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User account not found");
  }
  return { user };
};


const updateProfile = async (
  userId: string,
  payload: {
    name?: string;
    phone?: string;
    address?: string;
    intro?: string;
  },
  imageFile?: string | any
) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is missing!");
  }

  // Check if user exists
  const userExist = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!userExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Handle image upload
  if (imageFile && userExist.photo) {
    deleteFiles([urlToFilename(userExist.photo)])
  }

  // Run transaction to update user and profile
  const updatedUser = await prisma.$transaction(async (tx) => {

    const profileExist = await tx.profile.findUnique({
      where: { userId },
    });

    if (!profileExist) {
      await tx.profile.create({
        data: {
          userId,
          ...(payload.name && { fullName: payload.name }),
          ...(payload.address && { address: payload.address }),
          ...(payload.intro && { intro: payload.intro }),
        },
      });
    }
    await tx.profile.update({
      where: { userId },
      data: {
        ...(payload.name && { fullName: payload.name }),
        ...(payload.address && { address: payload.address }),
        ...(payload.intro && { intro: payload.intro }),
      },
    });

    const userUpdate = await tx.user.update({
      where: { id: userId },
      data: {
        ...(imageFile && { photo: imageFile }),
        ...(payload.name && { name: payload.name }),
        ...(payload.phone && { phone: payload.phone }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
        phone: true,
        profile: {
          select: {
            fullName: true,
            address: true,
            intro: true
          }
        }
      }
    });

    return userUpdate;
  });

  return updatedUser;
};

const changePassword = async (
  userId: string,
  payload: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  const { oldPassword, newPassword } = payload;
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "User ID is missing!");
  }

  if (!oldPassword || !newPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password and new password are required!"
    );
  }

  if (oldPassword === newPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New password cannot be the same as old password!"
    );
  }

  const userExist = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User account not found!");
  }

  return await prisma.$transaction(async (TX: Prisma.TransactionClient) => {
    const isCorrectPassword = await comparePassword(
      oldPassword,
      userExist?.password
    );
    if (!isCorrectPassword) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect current password!");
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await TX.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      }
    });

    return true;
  });
};
interface GetAllOptions {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

const userList = async (adminId: string, req: Request) => {
  const queryLoad: GetAllOptions = req.query;

  // Parse with defaults
  const page = parseInt(queryLoad.page || "1");
  const limit = parseInt(queryLoad.limit || "10");

  // Set defaults for sorting
  const sortBy = queryLoad.sortBy || 'createdAt';
  const sortOrder = queryLoad.sortOrder || 'desc';

  const search = queryLoad.search;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  // Search functionality
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Admin validation
  if (!adminId) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin ID is missing!");
  }

  const adminExist = await prisma.user.findUnique({
    where: { id: adminId },
  });

  if (!adminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin account not found");
  }

  // Get total count
  const total = await prisma.user.count({ where });

  // Get paginated users with basic info
  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photo: true,
      role: true,
      createdAt: true,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    }
  });

  if (!users || users.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found");
  }

  // Get user IDs for batch queries
  const userIds = users.map(user => user.id);

  // Get order statistics in one batch query
  const orderStats = await prisma.order.groupBy({
    by: ['userId'],
    where: {
      userId: { in: userIds }
    },
    _count: {
      _all: true
    },
    _max: {
      createdAt: true
    }
  });

  // Create a map for quick lookup of order stats
  const orderStatsMap = new Map();
  orderStats.forEach(stat => {
    orderStatsMap.set(stat.userId, {
      totalOrders: stat._count._all,
      lastOrderDate: stat._max.createdAt
    });
  });

  // Combine user data with order statistics
  const usersWithOrderStats = users.map(user => {
    const stats = orderStatsMap.get(user.id) || {
      totalOrders: 0,
      lastOrderDate: null
    };

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      photo: user.photo,
      role: user.role,
      joinedDate: user.createdAt,
      lastOrderDate: stats.lastOrderDate,
      totalOrders: stats.totalOrders
    };
  });

  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    users: usersWithOrderStats
  };
};

export const UserService = {
  getProfile,
  updateProfile,
  changePassword,
  userList
};
