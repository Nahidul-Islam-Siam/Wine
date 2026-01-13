import prisma from "../../../config/db.prisma";
import { ApiError } from "../../../errors/apiError";
import httpStatus from "http-status";

import { deleteFiles } from "../../../helpers/files/fileDelete";
import { urlsToFilenames } from "../../../helpers/files/utils/file-url.utils";

const create = async (
  adminId: string,
  payload: {
    name: string;
    shortDes: string;
    des?: string;
    images: string | any;
    sizeId: string;
    categoryId: any;
    brandId: any;
    tag?: string;
    price: string;
    discount?: boolean;
    discountPercent?: string | any;
    stock?: boolean;
    quantity: string;
  },
) => {
  if (!adminId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin ID is missing!");
  }
  const adminExist = await prisma.user.findUnique({
    where: { id: adminId },
  });
  if (!adminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found!");
  }
  const product = await prisma.product.create({
    data: {
      name: payload.name,
      des: payload.des,
      images: payload.images,
      tag: payload.tag,
      price: payload.price,
      discount: payload.discount,
      discountPercent: payload.discountPercent,
      stock: payload.stock,
      quantity: payload.quantity,
      shortDes: payload.shortDes,
      Size: {
        connect: { id: payload.sizeId }
      },
      category: {
        connect: { id: payload.categoryId },
      },
      brand: {
        connect: { id: payload.brandId },
      },
      creator: {
        connect: { id: adminId },
      },
    },
  });
  return product;
};

interface UpdateProductPayload {
  name?: string;
  shortDes?: string;
  des?: string;
  images?: string[]; // Should be array of strings
  sizeId?: string;
  categoryId?: string;
  brandId?: string;
  tag?: string;
  price?: string;
  discount?: boolean;
  discountPercent?: string;
  stock?: boolean;
  quantity?: string;
  removeImages?: string[]; // Should be array of image URLs to remove
}

const update = async (
  id: string,
  adminId: string,
  payload: UpdateProductPayload,
) => {
  if (!adminId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin ID is missing!");
  }

  const adminExist = await prisma.user.findUnique({
    where: { id: adminId },
  });

  if (!adminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found!");
  }

  const productExist = await prisma.product.findUnique({
    where: { id },
  });

  if (!productExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found!");
  }

  const updateData: any = { ...payload };

  if (payload.removeImages && Array.isArray(payload.removeImages) && payload.removeImages.length > 0) {
    try {
      await deleteFiles(urlsToFilenames(payload.removeImages));

      if (productExist.images && productExist.images.length > 0) {
        updateData.images = productExist.images.filter(
          image => !payload.removeImages?.includes(image)
        );
      }
    } catch (error) {
      console.error("Error deleting files:", error);
    }
    delete updateData.removeImages;
  }

  if (payload.images) {
    if (Array.isArray(payload.images)) {
      const existingImages = productExist.images || [];
      updateData.images = [...existingImages, ...payload.images];
    } else {
      updateData.images = Array.isArray(productExist.images)
        ? [...productExist.images, payload.images]
        : [payload.images];
    }
  }

  if (payload.sizeId) {
    const sizeExists = await prisma.size.findUnique({
      where: { id: payload.sizeId },
    });
    if (!sizeExists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Size not found!");
    }
  }

  if (payload.categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });
    if (!categoryExists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Category not found!");
    }
  }

  if (payload.brandId) {
    const brandExists = await prisma.brand.findUnique({
      where: { id: payload.brandId },
    });
    if (!brandExists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Brand not found!");
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      brand: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return product;
};



interface GetAllOptions {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  categoryId?: string;
  brandId?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  hasDiscount?: string;
}

const getAll = async (req) => {
  const queryLoad: GetAllOptions = req.query;

  // Parse with defaults
  const page = parseInt(queryLoad.page || "1");
  const limit = parseInt(queryLoad.limit || "10");

  // Set defaults for sorting
  const sortBy = queryLoad.sortBy || 'createdAt';
  const sortOrder = queryLoad.sortOrder || 'desc';

  const categoryId = queryLoad.categoryId;
  const brandId = queryLoad.brandId;
  const search = queryLoad.search;

  // Parse prices - only if provided
  const minPrice = queryLoad.minPrice ? parseInt(queryLoad.minPrice) : undefined;
  const maxPrice = queryLoad.maxPrice ? parseInt(queryLoad.maxPrice) : undefined;

  console.log('Query params:', req.query);

  // Handle boolean conversions
  let inStock: boolean | undefined;
  if (queryLoad.inStock === "true") {
    inStock = true;
  } else if (queryLoad.inStock === "false") {
    inStock = false;
  }

  let hasDiscount: boolean | undefined;
  if (queryLoad.hasDiscount === "true") {
    hasDiscount = true;
  } else if (queryLoad.hasDiscount === "false") {
    hasDiscount = false;
  }

  const skip = (page - 1) * limit;

  // Build where clause dynamically
  const where: any = {};

  if (categoryId) where.categoryId = categoryId;
  if (brandId) where.brandId = brandId;
  if (inStock !== undefined) where.stock = inStock;
  if (hasDiscount !== undefined) where.discount = hasDiscount;

  // Price filtering - only if values are valid numbers
  if ((minPrice !== undefined && !isNaN(minPrice)) ||
    (maxPrice !== undefined && !isNaN(maxPrice))) {
    where.price = {};

    if (minPrice !== undefined && !isNaN(minPrice)) {
      where.price.gte = minPrice.toString();
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      where.price.lte = maxPrice.toString();
    }
  }

  // Search functionality
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { des: { contains: search, mode: 'insensitive' } },
      { shortDes: { contains: search, mode: 'insensitive' } }
    ];
  }

  console.log('Where clause:', JSON.stringify(where, null, 2));

  // Get total count with filters
  const total = await prisma.product.count({ where });

  if (total === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No products found matching your criteria");
  }

  // Get paginated products
  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      shortDes: true,
      des: true,
      images: true,
      price: true,
      discount: true,
      discountPercent: true,
      stock: true,
      quantity: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true
        }
      },
      brand: {
        select: {
          id: true,
          name: true
        }
      },
      Size: {
        select: {
          id: true,
          name: true
        }
      }
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    }
  });

  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    products
  };
};

const getAllByAdmin = async (req) => {
  const queryLoad: GetAllOptions = req.query;

  // Parse with defaults
  const page = parseInt(queryLoad.page || "1");
  const limit = parseInt(queryLoad.limit || "10");

  // Set defaults for sorting
  const sortBy = queryLoad.sortBy || 'createdAt';
  const sortOrder = queryLoad.sortOrder || 'desc';

  const categoryId = queryLoad.categoryId;
  const brandId = queryLoad.brandId;
  const search = queryLoad.search;

  // Parse prices - only if provided
  const minPrice = queryLoad.minPrice ? parseInt(queryLoad.minPrice) : undefined;
  const maxPrice = queryLoad.maxPrice ? parseInt(queryLoad.maxPrice) : undefined;

  console.log('Query params:', req.query);

  // Handle boolean conversions
  let inStock: boolean | undefined;
  if (queryLoad.inStock === "true") {
    inStock = true;
  } else if (queryLoad.inStock === "false") {
    inStock = false;
  }

  let hasDiscount: boolean | undefined;
  if (queryLoad.hasDiscount === "true") {
    hasDiscount = true;
  } else if (queryLoad.hasDiscount === "false") {
    hasDiscount = false;
  }

  const skip = (page - 1) * limit;

  // Build where clause dynamically
  const where: any = {};

  if (categoryId) where.categoryId = categoryId;
  if (brandId) where.brandId = brandId;
  if (inStock !== undefined) where.stock = inStock;
  if (hasDiscount !== undefined) where.discount = hasDiscount;

  // Price filtering - only if values are valid numbers
  if ((minPrice !== undefined && !isNaN(minPrice)) ||
    (maxPrice !== undefined && !isNaN(maxPrice))) {
    where.price = {};

    if (minPrice !== undefined && !isNaN(minPrice)) {
      where.price.gte = minPrice.toString();
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      where.price.lte = maxPrice.toString();
    }
  }

  // Search functionality
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { des: { contains: search, mode: 'insensitive' } },
      { shortDes: { contains: search, mode: 'insensitive' } }
    ];
  }

  console.log('Where clause:', JSON.stringify(where, null, 2));

  // Get total count with filters
  const total = await prisma.product.count({ where });

  if (total === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No products found matching your criteria");
  }

  // Get paginated products
  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      shortDes: true,
      des: true,
      images: true,
      price: true,
      discount: true,
      discountPercent: true,
      stock: true,
      quantity: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true
        }
      },
      brand: {
        select: {
          id: true,
          name: true
        }
      },
      Size: {
        select: {
          id: true,
          name: true,
        }
      }
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    }
  });

  // Get product IDs for batch statistics query
  const productIds = products.map(product => product.id);

  // Get order product statistics for these products
  const orderProducts = await prisma.orderProduct.findMany({
    where: {
      productId: { in: productIds },
      // order: {
      //   // Only count completed orders for sales statistics
      //   status: 'COMPLETED'
      // }
    },
    select: {
      productId: true,
      quantity: true,
      price: true,
      order: {
        select: {
          id: true,
          status: true,
          payments: {
            where: {
              status: 'CONFIRMED'
            },
            select: {
              amount: true,
              paidAmount: true
            }
          }
        }
      }
    }
  });

  // Calculate statistics per product
  const productStats = new Map();

  // Initialize all products with zero stats
  products.forEach(product => {
    productStats.set(product.id, {
      totalSales: 0,
      totalQuantitySold: 0,
      totalRevenue: 0,
      totalPayments: 0
    });
  });

  // Calculate stats from order products
  orderProducts.forEach(op => {
    const stats = productStats.get(op.productId);
    if (stats) {
      stats.totalQuantitySold += op.quantity;
      stats.totalRevenue += op.price * op.quantity;

      // Calculate payments from completed orders
      if (op.order?.payments?.length > 0) {
        const confirmedPayments = op.order.payments.filter((p: any) => p.status === 'CONFIRMED');
        stats.totalPayments += confirmedPayments.reduce((sum, payment) =>
          sum + (payment.paidAmount || payment.amount), 0);
        stats.totalSales++;
      }
    }
  });

  // Combine products with their statistics
  const productsWithStats = products.map(product => {
    const stats = productStats.get(product.id);
    const availableQuantity = parseInt(product.quantity) - (stats?.totalQuantitySold || 0);

    return {
      ...product,
      statistics: {
        totalSales: stats?.totalSales || 0,
        totalQuantitySold: stats?.totalQuantitySold || 0,
        totalRevenue: stats?.totalRevenue || 0,
        totalPayments: stats?.totalPayments || 0,
        totalAvailable: availableQuantity > 0 ? availableQuantity : 0,
        isOutOfStock: availableQuantity <= 0
      }
    };
  });

  // Get all order products for total revenue calculation
  const allOrderProductsForRevenue = await prisma.orderProduct.findMany({
    select: {
      price: true,
      quantity: true
    }
  });

  // Calculate total revenue manually (price * quantity)
  const totalRevenue = allOrderProductsForRevenue.reduce((sum, op) => {
    return sum + (op.price * op.quantity);
  }, 0);

  // Get overall dashboard statistics
  const overallStats = {
    totalProducts: total,
    totalProductsInStock: await prisma.product.count({ where: { ...where, stock: true } }),
    totalProductsOutOfStock: await prisma.product.count({ where: { ...where, stock: false } }),
    totalProductsWithDiscount: await prisma.product.count({ where: { ...where, discount: true } }),
    totalSales: await prisma.order.count(),
    totalRevenue: totalRevenue
  };

  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    products: productsWithStats,
    dashboardStats: overallStats
  };
};
const get = async (id: string) => {
  if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "Product Id is required!")
  const product = await prisma.product.findUnique({
    where: {
      id
    },
    include: {
      category: true,
      brand: true,
      Size: true,
      reviews: true,
    }
  });
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "No found found with this id");
  }
  return product;
};

const remove = async (id: string, adminId: string) => {

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

  if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "Product Id is required!")
  const productExist = await prisma.product.findUnique({
    where: { id }
  });
  if (!productExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "No product found with this id");
  }

  const result = await prisma.$transaction(async (tx) => {
    // Delete reviews associated with the product first
    await tx.review.deleteMany({
      where: {
        productId: id
      }
    });

    await tx.cart.deleteMany({
      where: {
        productId: id
      }
    });

    await tx.wishlist.deleteMany({
      where: {
        productId: id
      }
    });

    // await tx.orderProduct.deleteMany({
    //   where: {
    //     productId: id
    //   }
    // });

    // Finally, delete the product
    const deletedProduct = await tx.product.delete({
      where: {
        id
      }
    });

    return deletedProduct;
  });

  return result;
};


export const ProductService = {
  create,
  update,
  getAll,
  getAllByAdmin,
  get,
  remove
};
