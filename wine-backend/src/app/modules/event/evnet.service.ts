import prisma from "../../../config/db.prisma";
import { ApiError } from "../../../errors/apiError";
import httpStatus from "http-status";

import { deleteFiles } from "../../../helpers/files/fileDelete";
import stripe from "../../service/stripe/stripe";
import { urlsToFilenames } from "../../../helpers/files/utils/file-url.utils";

const create = async (
  adminId: string,
  payload: {
    name: string;
    des?: string;
    images: string | any;
    startDate: string | any;
    endDate: string | any;
    audienceSize: string;
    price: string;
    status?: string | any;
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
  const event = await prisma.event.create({
    data: {
      name: payload.name,
      des: payload.des,
      images: payload.images,
      startDate: payload.startDate,
      endDate: payload.endDate,
      audienceSize: payload.audienceSize,
      price: payload.price,
      status: payload.status || 'UPCOMING',
    },
  });
  return event;
};


const update = async (
  id: string,
  adminId: string,
  payload: {
    name?: string;
    des?: string;
    images?: string | any;
    startDate?: string | any;
    endDate?: string | any;
    audienceSize?: string;
    price?: string;
    status?: string | any;
    removeImages?: string[];
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

  const eventExist = await prisma.event.findUnique({
    where: { id },
  });

  if (!eventExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found!");
  }

  const updateData: any = { ...payload };

  if (payload.removeImages && Array.isArray(payload.removeImages) && payload.removeImages.length > 0) {
    try {
      await deleteFiles(urlsToFilenames(payload.removeImages));

      if (eventExist.images && eventExist.images.length > 0) {
        updateData.images = eventExist.images.filter(
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
      const existingImages = eventExist.images || [];
      updateData.images = [...existingImages, ...payload.images];
    } else {
      updateData.images = Array.isArray(eventExist.images)
        ? [...eventExist.images, payload.images]
        : [payload.images];
    }
  }

  const eventUpdate = await prisma.event.update({
    where: { id },
    data: updateData,
  });

  return eventUpdate;
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

  const search = queryLoad.search;


  console.log('Query params:', req.query);

  const skip = (page - 1) * limit;

  // Build where clause dynamically
  const where: any = {};

  // Search functionality
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { des: { contains: search, mode: 'insensitive' } },
    ];
  }

  console.log('Where clause:', JSON.stringify(where, null, 2));

  // Get total count with filters
  const total = await prisma.event.count({ where });

  if (total === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No event found matching your criteria");
  }

  // Get paginated events
  const events = await prisma.event.findMany({
    where,
    select: {
      id: true,
      name: true,
      des: true,
      images: true,
      price: true,
      startDate: true,
      endDate: true,
      audienceSize: true,
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
    events
  };
};

// const getAllByAdmin = async (req) => {
//   const queryLoad: GetAllOptions = req.query;

//   // Parse with defaults
//   const page = parseInt(queryLoad.page || "1");
//   const limit = parseInt(queryLoad.limit || "10");

//   // Set defaults for sorting
//   const sortBy = queryLoad.sortBy || 'createdAt';
//   const sortOrder = queryLoad.sortOrder || 'desc';

//   const search = queryLoad.search;
//   const status = queryLoad.status as EventStatus; // Filter by event status

//   console.log('Query params:', req.query);

//   const skip = (page - 1) * limit;

//   // Build where clause dynamically
//   const where: any = {};

//   // Filter by status if provided
//   if (status) {
//     where.status = status;
//   }

//   // Search functionality
//   if (search) {
//     where.OR = [
//       { name: { contains: search, mode: 'insensitive' } },
//       { des: { contains: search, mode: 'insensitive' } },
//     ];
//   }

//   console.log('Where clause:', JSON.stringify(where, null, 2));

//   // Get total count with filters
//   const total = await prisma.event.count({ where });

//   if (total === 0) {
//     throw new ApiError(httpStatus.NOT_FOUND, "No events found matching your criteria");
//   }

//   // Get paginated events
//   const events = await prisma.event.findMany({
//     where,
//     select: {
//       id: true,
//       name: true,
//       des: true,
//       images: true,
//       price: true,
//       startDate: true,
//       endDate: true,
//       audienceSize: true,
//       status: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//     skip,
//     take: limit,
//     orderBy: {
//       [sortBy]: sortOrder
//     }
//   });

//   // Get event IDs for batch statistics query
//   const eventIds = events.map(event => event.id);

//   // Get event booking statistics for these events
//   const eventBookings = await prisma.eventBooking.findMany({
//     where: {
//       eventId: { in: eventIds },
//     },
//     include: {
//       payment: {
//         where: {
//           status: 'CONFIRMED'
//         },
//         select: {
//           amount: true,
//           paidAmount: true
//         }
//       }
//     }
//   });

//   // Calculate statistics per event
//   const eventStats = new Map();

//   // Initialize all events with zero stats
//   events.forEach(event => {
//     eventStats.set(event.id, {
//       totalBookings: 0,
//       totalRevenue: 0,
//       totalPaid: 0
//     });
//   });

//   // Calculate stats from event bookings
//   eventBookings.forEach(booking => {
//     const stats = eventStats.get(booking.eventId);
//     if (stats) {
//       stats.totalBookings += 1;

//       // Calculate revenue from confirmed payments
//       if (booking.payment) {
//         stats.totalRevenue += booking.payment.amount || 0;
//         stats.totalPaid += booking.payment.paidAmount || booking.payment.amount || 0;
//       }
//     }
//   });

//   // Combine events with their statistics
//   const eventsWithStats = events.map(event => {
//     const stats = eventStats.get(event.id);
//     const priceNum = parseFloat(event.price) || 0;

//     return {
//       ...event,
//       statistics: {
//         totalBookings: stats?.totalBookings || 0,
//         totalRevenue: stats?.totalRevenue || 0,
//         totalPaid: stats?.totalPaid || 0,
//         // Calculate available spots if audienceSize is numeric
//         totalAvailable: isNaN(parseInt(event.audienceSize)) 
//           ? null 
//           : parseInt(event.audienceSize) - (stats?.totalBookings || 0)
//       }
//     };
//   });

//   // Get all event bookings for total revenue calculation
//   const allEventBookingsForRevenue = await prisma.eventBooking.findMany({
//     include: {
//       payment: {
//         where: {
//           status: 'CONFIRMED'
//         },
//         select: {
//           amount: true
//         }
//       }
//     }
//   });

//   // Calculate total revenue from all event bookings
//   const totalEventRevenue = allEventBookingsForRevenue.reduce((sum, booking) => {
//     if (booking.payment) {
//       return sum + (booking.payment.amount || 0);
//     }
//     return sum;
//   }, 0);

//   // Get overall dashboard statistics for events
//   const overallStats = {
//     totalEvents: await prisma.event.count(),
//     totalUpcomingEvents: await prisma.event.count({ where: { status: 'UP_COMMING' } }),
//     totalRunningEvents: await prisma.event.count({ where: { status: 'RUNNING' } }),
//     totalCompletedEvents: await prisma.event.count({ where: { status: 'COMPLETE' } }),
//     totalBookings: await prisma.eventBooking.count(),
//     totalEventRevenue: totalEventRevenue,
//     confirmedEventPayments: await prisma.payment.count({ 
//       where: { 
//         status: 'CONFIRMED',
//         eventBookingId: { not: null }
//       } 
//     })
//   };

//   const totalPages = Math.ceil(total / limit);

//   return {
//     total,
//     page,
//     limit,
//     totalPages,
//     hasNext: page < totalPages,
//     hasPrev: page > 1,
//     events: eventsWithStats,
//     dashboardStats: overallStats
//   };
// };

const get = async (id: string) => {
  if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "Event Id is required!")
  const event = await prisma.event.findUnique({
    where: {
      id
    }
  });
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "No found found with this id");
  }
  return event;
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

  if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "Event Id is required!")
  const eventExist = await prisma.event.findUnique({
    where: { id }
  });
  if (!eventExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "No event found with this id");
  }

  const result = await prisma.$transaction(async (tx) => {
    // Delete reviews associated with the event first
    await tx.eventBooking.deleteMany({
      where: {
        eventId: id
      }
    });

    // Finally, delete the event
    const deletedEvent = await tx.event.delete({
      where: {
        id
      }
    });
    return deletedEvent;
  });

  return result;
};




// ===== Booking Services ==========

export const createBookingWithPayment = async (
  userId: string,
  eventId: string,
  paymentMethod: 'CARD',
  bookingDetails?: {
    person?: string;
  }
) => {
  try {
    // Get user and event details (outside transaction)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true }
    });

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found");

    // Validate event availability
    if (event.status !== 'UP_COMMING' && event.status !== 'RUNNING') {
      throw new ApiError(httpStatus.BAD_REQUEST, "Event is not available for booking");
    }

    // Check capacity
    const totalCapacity = parseInt(event.audienceSize);
    if (!isNaN(totalCapacity)) {
      const currentBookings = await prisma.eventBooking.count({
        where: { eventId, status: { in: ['CONFIRMED', 'PENDING'] } }
      });
      if (currentBookings >= totalCapacity) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Event is fully booked");
      }
    }

    // Check duplicate booking
    const existingBooking = await prisma.eventBooking.findFirst({
      where: { userId, eventId, status: { in: ['CONFIRMED'] } }
    });
    if (existingBooking) {
      throw new ApiError(httpStatus.BAD_REQUEST, "You already have a booking for this event");
    }

    const amount = parseFloat(event.price) || 0;
    const bookingRef = `EVT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create event booking
    const eventBooking = await prisma.eventBooking.create({
      data: {
        eventId,
        userId,
        person: bookingDetails?.person || "1",
        bookingDate: new Date(),
        status: 'PENDING'
      }
    });

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        userId,
        eventBookingId: eventBooking.id,
        amount,
        currency: 'usd',
        status: 'PENDING',
        method: 'CARD',
        name: `Event Booking: ${event.name}`,
      }
    });

    // Update event booking with payment ID
    await prisma.eventBooking.update({
      where: { id: eventBooking.id },
      data: { paymentId: payment.id }
    });

    // Create Stripe session
    const checkoutSession = await createEventCheckoutSession(
      userId,
      payment.id,
      eventBooking.id,
      event,
      user,
      bookingRef
    );

    // Update payment with stripe session ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripeSessionId: checkoutSession.sessionId,
        metadata: {
          bookingRef,
          eventId: event.id,
          eventName: event.name,
          type: 'event_booking'
        },
      }
    });

    return {
      eventBookingId: eventBooking.id,
      paymentId: payment.id,
      payment: {
        type: 'stripe',
        sessionId: checkoutSession.sessionId,
        url: checkoutSession.url,
        amount
      }
    };
  } catch (error) {
    console.error('Error creating event booking with payment:', error);

    // Rollback on error (optional)
    if (error instanceof ApiError) {
      throw error;
    }

    // Clean up on error
    await cleanupFailedBooking(userId, eventId).catch(console.error);

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create event booking");
  }
};

const cleanupFailedBooking = async (userId: string, eventId: string) => {
  try {
    // Find and delete any pending bookings for this user/event
    const pendingBooking = await prisma.eventBooking.findFirst({
      where: {
        userId,
        eventId,
        status: 'PENDING'
      },
      include: { payment: true }
    });

    if (pendingBooking) {
      if (pendingBooking.payment) {
        await prisma.payment.delete({ where: { id: pendingBooking.payment.id } });
      }
      await prisma.eventBooking.delete({ where: { id: pendingBooking.id } });
    }
  } catch (cleanupError) {
    console.error('Error during cleanup:', cleanupError);
  }
};

const createEventCheckoutSession = async (
  userId: string,
  paymentId: string,
  eventBookingId: string,
  event: any,
  user: any,
  bookingRef: string
) => {
  try {
    const amount = parseFloat(event.price) || 0;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: event.name,
            description: `Event booking for ${event.name}`,
            images: event.images?.length > 0 ? [event.images[0]] : [],
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      metadata: {
        userId,
        paymentId,
        eventBookingId,
        bookingRef,
        eventId: event.id,
        eventName: event.name,
        type: 'event_booking'
      },
      success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/cancel?booking_id=${eventBookingId}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return {
      sessionId: session.id,
      url: session.url,
      expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : null
    };
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw error;
  }
};
export const getBookingById = async (bookingId: string, userId?: string) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
  }
  if (!bookingId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Booking ID is required");
  }
  const where: any = { id: bookingId };

  // If userId provided, ensure user owns the booking
  if (userId) {
    where.userId = userId;
  }

  const booking = await prisma.eventBooking.findUnique({
    where,
    include: {
      event: {
        select: {
          id: true,
          name: true,
          images: true,
          startDate: true,
          endDate: true,
          price: true,
          status: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      payment: {
        select: {
          id: true,
          amount: true,
          paidAmount: true,
          status: true,
          method: true,
          stripeSessionId: true,
          transactionId: true,
          createdAt: true
        }
      }
    }
  });

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event booking not found");
  }

  return booking;
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

export const allBookingsByCustomer = async (userId: string, req: any) => {
  const queryLoad: {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  } = req.query;

  // Parse with defaults
  const page = parseInt(queryLoad.page || "1");
  const limit = parseInt(queryLoad.limit || "10");

  // Set defaults for sorting
  const sortBy = queryLoad.sortBy || 'createdAt';
  const sortOrder = queryLoad.sortOrder || 'desc';


  console.log('Query params:', req.query);

  const skip = (page - 1) * limit;

  // Build where clause dynamically
  const where: any = { userId };

  const total = await prisma.eventBooking.count({ where });

  if (total === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No booked event found!");
  }

  // Get paginated event bookings
  const bookings = await prisma.eventBooking.findMany({
    where,
    select: {
      id: true,
      eventId: true,
      userId: true,
      person: true,
      payment: {
        select: {
          id: true,
          amount: true,
          paidAmount: true,
          status: true,
        }
      },
      user: {
        select: {
          name: true,
          email: true,
          photo: true,
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
    bookings
  };
};

export const allBookingsByAdmin = async (req: any) => {
  const queryLoad: {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  } = req.query;

  // Parse with defaults
  const page = parseInt(queryLoad.page || "1");
  const limit = parseInt(queryLoad.limit || "10");

  // Set defaults for sorting
  const sortBy = queryLoad.sortBy || 'createdAt';
  const sortOrder = queryLoad.sortOrder || 'desc';


  console.log('Query params:', req.query);

  const skip = (page - 1) * limit;

  // Build where clause dynamically
  const where: any = {};

  const total = await prisma.eventBooking.count({ where });

  if (total === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No booked event found!");
  }

  // Get paginated bookings
  const bookings = await prisma.eventBooking.findMany({
    where,
    select: {
      id: true,
      eventId: true,
      userId: true,
      person: true,
      payment: {
        select: {
          id: true,
          amount: true,
          paidAmount: true,
          status: true,
        }
      },
      user: {
        select: {
          name: true,
          email: true,
          photo: true,
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
    bookings
  };
};

export const EventService = {
  create,
  update,
  getAll,
  get,
  remove,
  createBookingWithPayment,
  createEventCheckoutSession,
  getBookingById,
  allBookingsByCustomer,
  allBookingsByAdmin
};
