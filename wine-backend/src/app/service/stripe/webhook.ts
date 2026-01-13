// controllers/webhook.controller.ts
import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import stripe from './stripe';
import { stripe_webhook_secret } from '../../../config/config';
import prisma from '../../../config/db.prisma';
import Stripe from 'stripe';



export const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      stripe_webhook_secret
    );

    await handleWebhookEvent(event);

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }
});


const handleWebhookEvent = async (event: Stripe.Event) => {
  try {
    // Store webhook event
    await prisma.stripeWebhookEvent.create({
      data: {
        eventId: event.id,
        type: event.type,
        data: event as any,
      },
    });

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        console.error('Payment intent succeeded:', event.data.object);
        break;

      case 'payment_intent.payment_failed':
        console.error('Payment intent failed:', event.data.object);

        break;
    }

    // Mark event as processed
    await prisma.stripeWebhookEvent.update({
      where: { eventId: event.id },
      data: { processed: true },
    });

  } catch (error) {
    console.error('Error handling webhook event:', error);
    throw error;
  }
}

const handleCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId;
  const orderId = session.metadata?.orderId;
  const eventBookingId = session.metadata?.eventBookingId;
  const paymentId = session.metadata?.paymentId;
  const type = session.metadata?.type;

  // Find payment by stripeSessionId OR paymentId from metadata
  let payment;

  if (paymentId) {
    // Find by paymentId from metadata (for event bookings)
    payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });
  } else {
    // Fallback to stripeSessionId (for backward compatibility)
    payment = await prisma.payment.findFirst({
      where: { stripeSessionId: session.id }
    });
  }

  if (!payment) {
    console.error('Payment not found for session:', session.id);
    throw new Error('Payment record not found');
  }

  // Update payment
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'CONFIRMED',
      stripePaymentIntentId: session.payment_intent as string,
      transactionId: session.payment_intent as string,
      paidAmount: session.amount_total ? session.amount_total / 100 : 0,
    },
  });

  // Handle EVENT BOOKING
  if (payment.eventBookingId) {
    await prisma.eventBooking.update({
      where: { id: payment.eventBookingId },
      data: {
        status: 'CONFIRMED'
      }
    });

    console.log(`Event booking ${payment.eventBookingId} confirmed`);
  }

  // Handle PRODUCT ORDER (existing logic)
  if (payment.orderId) {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: 'CONFIRMED',
        status: 'PENDING',
      },
    });

    console.log(`Product order ${payment.orderId} payment confirmed`);
  }

  console.log(`Payment ${payment.id} processed successfully`);
};


const handleCheckoutSessionExpired = async (session: Stripe.Checkout.Session) => {
  const eventBookingId = session.metadata?.eventBookingId;
  const paymentId = session.metadata?.paymentId;

  // Find payment
  let payment;

  if (paymentId) {
    payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });
  } else {
    payment = await prisma.payment.findFirst({
      where: { stripeSessionId: session.id }
    });
  }

  if (payment) {
    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });

    // If this is an event booking payment, update booking status too
    if (payment.eventBookingId) {
      await prisma.eventBooking.update({
        where: { id: payment.eventBookingId },
        data: {
          status: 'CANCELLED',
        },
      });
    }
  }

  // Handle product order (existing logic)
  const orderId = session.metadata?.orderId;
  if (orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'FAILED',
        status: 'CANCELLED',
      },
    });
  }
};
export default handleWebhook;