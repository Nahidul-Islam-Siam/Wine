import prisma from "../../../config/db.prisma";
import httpStatus from "http-status"
import { ApiError } from "../../../errors/apiError";
import stripe from "../../service/stripe/stripe";

export const createCheckoutSession = async (
  userId: string,
  orderId: string,
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>,
  customerDetails: {
    email: string;
    name: string;
  },
  metadata: any = {}
) => {
  try {
    // Format line items for Stripe
    const lineItems = items.map(item => {
      // Handle shipping fee separately
      if (item.productId === 'shipping') {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      }

      // Regular product items
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerDetails.email,
      line_items: lineItems,
      metadata: {
        userId,
        orderId,
        ...metadata,
      },
      success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/cancel?order_id=${orderId}`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'IN'], // Customize as needed
      },
    });

    // Create payment record
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    await prisma.payment.create({
      data: {
        userId,
        orderId,
        stripeSessionId: session.id,
        amount: totalAmount,
        currency: 'usd',
        status: 'PENDING',
        method: 'CARD',
        metadata: metadata,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export const history = async (
  userId: string,
  req: any
) => {
  const queryLoad = req.query;

  // Parse with defaults
  const page = parseInt(queryLoad.page || "1");
  const limit = parseInt(queryLoad.limit || "10");

  const sortOrder = queryLoad.sortOrder || 'desc';
  const sortBy = queryLoad.sortBy || 'createdAt'; // Default sorting by createdAt

  console.log('Query params:', req.query);
  const skip = (page - 1) * limit;

  const userExist = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
  if (!userExist) throw new ApiError(httpStatus.NOT_FOUND, "User not found")

  // Build where clause dynamically
  const where: any = { userId };

  // Get total count with filters
  const total = await prisma.payment.count({ where });

  if (total === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No payments found matching your criteria");
  }

  // Get paginated payments
  const payments = await prisma.payment.findMany({
    where,
    select: {
      id: true,
      userId: true,
      orderId: true,
      eventBookingId: true,
      transactionId: true,
      name: true,
      amount: true,
      paidAmount: true,
      currency: true,
      status: true,
      method: true,
      order: {
        select: {
          id: true,
          userId: true,
          amount: true,
          orderNo: true,
          name: true,
          email: true,
          address: true,
          currency: true,
          shippingFee: true,
          paymentMethod: true,
          orderProducts: {
            include: {
              product: {
                select: {
                  name: true,
                  images: true,
                }
              }
            }
          }
        }

      },
      eventBooking: {
        select: {
          id: true,
          eventId: true,
          userId: true,
          paymentId: true,
          person: true,
          bookingDate: true,
          status: true,
        }
      }
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder // Correct format: { createdAt: 'desc' }
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
    payments
  };
};

export const adminHistory = async (
  adminId: string,
  req: any
) => {
  const queryLoad = req.query;

  // Parse with defaults
  const page = parseInt(queryLoad.page || "1");
  const limit = parseInt(queryLoad.limit || "10");

  const sortOrder = queryLoad.sortOrder || 'desc';
  const sortBy = queryLoad.sortBy || 'createdAt'; // Default sorting by createdAt

  console.log('Query params:', req.query);
  const skip = (page - 1) * limit;


  const adminExist = await prisma.user.findUnique({
    where: {
      id: adminId
    }
  })
  if (!adminExist) throw new ApiError(httpStatus.NOT_FOUND, "Admin not found")

  // Build where clause dynamically
  const where: any = {};

  // Get total count with filters
  const total = await prisma.payment.count({ where });

  if (total === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No payments found matching your criteria");
  }

  // Get paginated payments
  const payments = await prisma.payment.findMany({
    where,
    select: {
      id: true,
      userId: true,
      orderId: true,
      eventBookingId: true,
      transactionId: true,
      name: true,
      amount: true,
      paidAmount: true,
      currency: true,
      status: true,
      method: true,
      order: {
        select: {
          id: true,
          userId: true,
          amount: true,
          orderNo: true,
          name: true,
          email: true,
          address: true,
          currency: true,
          shippingFee: true,
          paymentMethod: true,
          orderProducts: {
            include: {
              product: {
                select: {
                  name: true,
                  images: true,
                }
              }
            }
          }
        }

      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder // Correct format: { createdAt: 'desc' }
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
    payments
  };
};


export const detais = async (
  adminId: string,
  id: string
) => {

  const adminExist = await prisma.user.findUnique({
    where: {
      id: adminId
    }
  })
  if (!adminExist) throw new ApiError(httpStatus.NOT_FOUND, "Admin not found")

  if (!id) throw new ApiError(httpStatus.NOT_IMPLEMENTED, "Payment id is required!")

  const paymentDetails = await prisma.payment.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      orderId: true,
      eventBookingId: true,
      transactionId: true,
      name: true,
      amount: true,
      paidAmount: true,
      currency: true,
      status: true,
      method: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          photo: true,
        }
      },
      order: {
        select: {
          id: true,
          userId: true,
          amount: true,
          paymentMethod: true,
        }
      }
    }

  })

  return paymentDetails;
};


// export const getPaymentStatus = async (orderId: string, userId?: string) => {
//   const where: any = { orderId };
//   if (userId) {
//     where.userId = userId;
//   }

//   const payment = await prisma.payment.findFirst({
//     where,
//     orderBy: { createdAt: 'desc' },
//     include: {
//       order: {
//         select: {
//           orderNo: true,
//           status: true,
//           amount: true,
//         },
//       },
//     },
//   });

//   if (!payment) {
//     throw new Error('Payment not found');
//   }

//   let stripeStatus = null;
//   if (payment.stripeSessionId) {
//     try {
//       const session = await stripe.checkout.sessions.retrieve(payment.stripeSessionId);
//       stripeStatus = session.payment_status;
//     } catch (error) {
//       console.error('Error fetching Stripe session:', error);
//     }
//   }

//   return {
//     payment,
//     stripeStatus,
//   };
// }


export const PaymentService = {
  createCheckoutSession,
  // getPaymentStatus,
  history,
  adminHistory,
  detais
};