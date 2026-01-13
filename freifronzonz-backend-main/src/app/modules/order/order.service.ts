import httpStatus from 'http-status';
import { ApiError } from '../../../errors/apiError';
import prisma from '../../../config/db.prisma';
import { PaymentService } from '../payment/payment.service';
import { randomInt } from 'crypto';

// const paymentService = new PaymentService();


export const createOrderFromCart = async (
  userId: string,
  shippingDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  },
  paymentMethod: 'CARD' | 'CASH_ON_DELIVERY'
) => {
  try {
    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // Get user's cart items with product details (matching your cart API structure)
      const cartItems = await tx.cart.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                }
              },
              brand: {
                select: {
                  id: true,
                  name: true,
                  img: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (!cartItems || cartItems.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Your cart is empty");
      }

      // Calculate prices (matching your cart calculation logic)
      const itemsWithPriceInfo = cartItems.map(cart => {
        const product = cart.product;
        const quantity = parseInt(cart.quantity, 10) || 0;

        // Parse price and discount (same as your cart API)
        const unitPrice = parseFloat(product.price) || 0;
        const shippingFee = parseFloat(product.shippingFee) || 0;
        const discountPercent = parseFloat(product.discountPercent) || 0;

        // Calculate discount
        const discountAmount = product.discount ? (unitPrice * discountPercent) / 100 : 0;
        const finalPrice = unitPrice - discountAmount;
        const itemTotal = (finalPrice * quantity) + shippingFee;

        return {
          cartId: cart.id,
          productId: product.id,
          name: product.name,
          price: unitPrice,
          finalPrice,
          discountAmount,
          discountPercent,
          shippingFee,
          quantity,
          itemTotal,
          image: product.images[0],
          productData: product,
        };
      });

      // Calculate cart summary (same as your cart API)
      let cartSummary = {
        subtotal: 0,
        totalDiscount: 0,
        totalItems: 0,
        totalQuantity: 0,
        totalShippingFee: 0,
        estimatedTotal: 0
      };

      itemsWithPriceInfo.forEach(item => {
        cartSummary.subtotal += item.price * item.quantity;
        cartSummary.totalDiscount += item.discountAmount * item.quantity;
        cartSummary.totalItems += 1;
        cartSummary.totalQuantity += item.quantity;
        cartSummary.totalShippingFee += item.shippingFee;
        cartSummary.estimatedTotal += item.itemTotal;
      });

      // Validate stock availability
      for (const item of itemsWithPriceInfo) {
        const product = item.productData;
        const availableQuantity = parseInt(product.quantity, 10) || 0;

        if (availableQuantity < item.quantity) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Insufficient stock for ${product.name}. Available: ${availableQuantity}, Requested: ${item.quantity}`
          );
        }
      }

      // Generate order number
      const orderNo = `ORD-${Date.now()}-${randomInt(1000, 9999)}`;

      // Create order
      const order = await tx.order.create({
        data: {
          orderNo,
          userId,
          name: shippingDetails.name,
          email: shippingDetails.email,
          phone: shippingDetails.phone,
          address: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          country: shippingDetails.country,
          zipCode: shippingDetails.zipCode,
          paymentMethod,
          amount: cartSummary.estimatedTotal,
          shippingFee: cartSummary.totalShippingFee,
          currency: 'usd',
          orderProducts: {
            create: itemsWithPriceInfo.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.finalPrice,
            })),
          },
        },
        include: {
          orderProducts: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
      });

      // Update product quantities
      for (const item of itemsWithPriceInfo) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: (parseInt(item.productData.quantity) - item.quantity).toString(),
            stock: parseInt(item.productData.quantity) - item.quantity > 0,
          },
        });
      }

      // Handle payment based on method
      if (paymentMethod === 'CARD') {
        // Prepare items for Stripe (without shipping fee in line items)
        const stripeItems = itemsWithPriceInfo.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.finalPrice,
          quantity: item.quantity,
          image: item.image,
        }));

        // Add shipping fee as separate line item for Stripe
        if (cartSummary.totalShippingFee > 0) {
          stripeItems.push({
            productId: 'shipping',
            name: 'Shipping Fee',
            price: cartSummary.totalShippingFee,
            quantity: 1,
            image: '',
          });
        }

        const checkoutSession = await PaymentService.createCheckoutSession(
          userId,
          order.id,
          stripeItems,
          {
            email: shippingDetails.email,
            name: shippingDetails.name,
          },
          {
            orderNo,
            cartSummary: JSON.stringify(cartSummary)
          }
        );

        return {
          // order,
          cartSummary,
          payment: {
            type: 'stripe',
            sessionId: checkoutSession.sessionId,
            url: checkoutSession.url,
          },
        };
      }
      // Clear user's cart
      await tx.cart.deleteMany({
        where: { userId },
      });
      // For cash on delivery
      await tx.payment.create({
        data: {
          userId,
          orderId: order.id,
          amount: cartSummary.estimatedTotal,
          currency: 'usd',
          status: 'PENDING',
          method: 'CASH_ON_DELIVERY',
        },
      });

      return {
        order,
        cartSummary,
        payment: {
          type: 'cash_on_delivery',
          message: 'Payment will be collected on delivery',
        },
      };
    });
  } catch (error) {
    console.error('Error creating order from cart:', error);
    throw error;
  }
}

export const allOrder = async (userId, req) => {
  const queryLoad: {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  } = req.query;

  // Parse pagination parameters with defaults
  const page = parseInt(queryLoad.page || "1");
  const limit = parseInt(queryLoad.limit || "10");

  // Set defaults for sorting
  const sortBy = queryLoad.sortBy || 'createdAt';
  const sortOrder = queryLoad.sortOrder || 'desc';

  const skip = (page - 1) * limit;

  // Get total count
  const total = await prisma.order.count();

  if (total === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No orders found");
  }

  // Get paginated orders with related data
  const orders = await prisma.order.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      orderNo: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      amount: true,
      currency: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      country: true,
      zipCode: true,
      shippingFee: true,
      createdAt: true,
      updatedAt: true,
      // User info
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          photo: true
        }
      },
      // Order products with product details
      orderProducts: {
        select: {
          id: true,
          quantity: true,
          price: true,
          isReviewed: true,
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true
            }
          }
        }
      },
      // Payment info
      payments: {
        select: {
          id: true,
          amount: true,
          paidAmount: true,
          status: true,
          method: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1 // Get latest payment
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
    orders
  };
};
export const allOrderAdmin = async (adminId, req) => {
  const queryLoad: {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  } = req.query;

  // Parse pagination parameters with defaults
  const page = parseInt(queryLoad.page || "1");
  const limit = parseInt(queryLoad.limit || "10");

  // Set defaults for sorting
  const sortBy = queryLoad.sortBy || 'createdAt';
  const sortOrder = queryLoad.sortOrder || 'desc';

  const skip = (page - 1) * limit;

  // Get total count
  const total = await prisma.order.count();

  if (total === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No orders found");
  }

  // Get paginated orders with related data
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      orderNo: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      amount: true,
      currency: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      country: true,
      zipCode: true,
      shippingFee: true,
      trackingNumber: true,
      estimatedDelivery: true,
      createdAt: true,
      updatedAt: true,
      // User info
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          photo: true
        }
      },
      // Order products with product details
      orderProducts: {
        select: {
          id: true,
          quantity: true,
          price: true,
          isReviewed: true,
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true
            }
          }
        }
      },
      // Payment info
      payments: {
        select: {
          id: true,
          amount: true,
          paidAmount: true,
          status: true,
          method: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1 // Get latest payment
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
    orders
  };
};

export const orderDetails = async (adminId, id) => {

  if (!adminId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin ID is missing!");
  }
  const adminExist = await prisma.user.findUnique({
    where: { id: adminId },
  });
  if (!adminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found!");
  }

  if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "Product Id is required!")

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderProducts: true,
      payments: true
    },
  });
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "No order found with this id");
  }

  return order;
};

export const updateStatus = async (
  adminId: string,
  id: string,
  payload: {
    status: string | any,
  }) => {

  if (!adminId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin ID is missing!");
  }
  const adminExist = await prisma.user.findUnique({
    where: { id: adminId },
  });
  if (!adminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found!");
  }

  if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "Product Id is required!")

  const order = await prisma.order.findUnique({
    where: { id },
  });
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "No order found with this id");
  }

  const orderUpdate = await prisma.order.update({
    where: { id },
    data: {
      status: payload.status,
    },
    select: {
      id: true,
      orderNo: true,
      status: true,
      userId: true,
      name: true,
      paymentMethod: true,
      paymentStatus: true,
    }
  })

  return orderUpdate;
};

// export const getOrder = async (orderId: string, userId?: string) => {
//   const where: any = { id: orderId };
//   if (userId) {
//     where.userId = userId;
//   }

//   const order = await prisma.order.findUnique({
//     where,
//     include: {
//       orderProducts: {
//         include: {
//           product: {
//             select: {
//               id: true,
//               name: true,
//               images: true,
//               price: true,
//             },
//           },
//         },
//       },
//       payments: {
//         orderBy: { createdAt: 'desc' },
//         take: 1,
//       },
//     },
//   });

//   if (!order) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
//   }

//   // Calculate order summary similar to cart summary
//   let orderSummary = {
//     subtotal: 0,
//     totalDiscount: 0,
//     totalItems: order.orderProducts.length,
//     totalQuantity: 0,
//     totalShippingFee: order.shippingFee || 0,
//     estimatedTotal: order.amount,
//   };

//   order.orderProducts.forEach(item => {
//     orderSummary.subtotal += (item.price * item.quantity);
//     orderSummary.totalQuantity += item.quantity;
//   });

//   orderSummary.totalDiscount = orderSummary.subtotal + orderSummary.totalShippingFee - orderSummary.estimatedTotal;

//   return {
//     order,
//     summary: orderSummary,
//   };
// }

// export const getUserOrders = async (userId: string, page: number = 1, limit: number = 10) => {
//   const skip = (page - 1) * limit;

//   const [orders, total] = await Promise.all([
//     prisma.order.findMany({
//       where: { userId },
//       include: {
//         orderProducts: {
//           include: {
//             product: {
//               select: {
//                 id: true,
//                 name: true,
//                 images: true,
//               },
//             },
//           },
//         },
//         payments: {
//           orderBy: { createdAt: 'desc' },
//           take: 1,
//         },
//       },
//       orderBy: { createdAt: 'desc' },
//       skip,
//       take: limit,
//     }),
//     prisma.order.count({ where: { userId } }),
//   ]);

//   // Calculate summary for each order
//   const ordersWithSummary = orders.map(order => {
//     let orderSummary = {
//       subtotal: 0,
//       totalItems: order.orderProducts.length,
//       totalQuantity: 0,
//       totalShippingFee: order.shippingFee || 0,
//     };

//     order.orderProducts.forEach(item => {
//       orderSummary.subtotal += (item.price * item.quantity);
//       orderSummary.totalQuantity += item.quantity;
//     });

//     return {
//       ...order,
//       summary: orderSummary,
//     };
//   });

//   return {
//     orders: ordersWithSummary,
//     pagination: {
//       page,
//       limit,
//       total,
//       pages: Math.ceil(total / limit),
//       hasNext: page < Math.ceil(total / limit),
//       hasPrev: page > 1,
//     },
//   };
// }

// export const cancelOrder = async (orderId: string, userId?: string) => {
//   const where: any = { id: orderId, status: 'PENDING' };
//   if (userId) {
//     where.userId = userId;
//   }

//   const order = await prisma.order.findUnique({
//     where,
//     include: {
//       orderProducts: true,
//       payments: {
//         where: { status: 'CONFIRMED' },
//       },
//     },
//   });

//   if (!order) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Order not found or cannot be cancelled");
//   }

//   // Restore product quantities
//   for (const item of order.orderProducts) {
//     // Get current product to check quantity
//     const product = await prisma.product.findUnique({
//       where: { id: item.productId },
//     });

//     if (product) {
//       // Convert string quantities to numbers, calculate new quantity, then convert back to string
//       const currentQuantity = parseInt(product.quantity) || 0;
//       const restoredQuantity = currentQuantity + item.quantity;

//       await prisma.product.update({
//         where: { id: item.productId },
//         data: {
//           quantity: restoredQuantity.toString(),
//           stock: restoredQuantity > 0,
//         },
//       });
//     }
//   }

//   // Update order status
//   const updatedOrder = await prisma.order.update({
//     where: { id: orderId },
//     data: {
//       status: 'CANCELLED',
//       paymentStatus: order.payments.length > 0 ? 'FAILED' : 'PENDING',
//     },
//   });

//   // Update payment status if exists
//   if (order.payments.length > 0) {
//     await prisma.payment.updateMany({
//       where: { orderId },
//       data: { status: 'CANCELLED' },
//     });
//   }

//   return updatedOrder;
// }

// export const updateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
//   const updateData: any = { status };

//   if (trackingNumber) {
//     updateData.trackingNumber = trackingNumber;
//   }

//   if (status === 'DISPATCHED') {
//     updateData.estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
//   }

//   if (status === 'COMPLETED') {
//     updateData.paymentStatus = 'CONFIRMED';
//   }

//   return await prisma.order.update({
//     where: { id: orderId },
//     data: updateData,
//   });
// }


export const OrderService = {
  createOrderFromCart,
  allOrder,
  allOrderAdmin,
  orderDetails,
  updateStatus,
  //   getUserOrders,
  //   cancelOrder,
  //   updateOrderStatus
};
