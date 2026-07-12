import { logger } from "@/lib/logger";

/**
 * Email service abstraction.
 *
 * In production, integrate with SendGrid / Amazon SES / Postmark.
 * For now, logs emails instead of sending them.
 *
 * Usage:
 *   import { emailService } from "@/lib/email";
 *   await emailService.sendWelcome(to, businessName);
 */

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  async send(params: EmailParams): Promise<boolean> {
    // In production:
    // await sgMail.send({ to: params.to, from: "noreply@verifiedbusiness.in", subject: params.subject, html: params.html });

    logger.info("Email sent (logged, not delivered)", {
      to: params.to,
      subject: params.subject,
    });
    return true;
  }

  async sendWelcome(to: string, businessName: string): Promise<boolean> {
    return this.send({
      to,
      subject: "Welcome to VerifiedBusiness.in — your listing is being reviewed",
      html: `
        <h2>Welcome to VerifiedBusiness.in!</h2>
        <p>Hi ${businessName} team,</p>
        <p>Thank you for listing your business on VerifiedBusiness.in. Our team will review your listing within 3-5 business days.</p>
        <p>Once approved, you'll receive a Verified badge and your listing will be live on our platform.</p>
        <p>Questions? Reply to this email or contact support@verifiedbusiness.in</p>
      `,
    });
  }

  async sendSubscriptionActivated(to: string, businessName: string, plan: string, amount: number): Promise<boolean> {
    return this.send({
      to,
      subject: `Subscription activated — ${plan} plan (₹${amount})`,
      html: `
        <h2>Subscription Activated!</h2>
        <p>Hi ${businessName} team,</p>
        <p>Your <strong>${plan}</strong> subscription has been activated successfully.</p>
        <p>Amount paid: ₹${amount.toLocaleString("en-IN")}</p>
        <p>Your invoice is available in your dashboard.</p>
      `,
    });
  }

  async sendExpiryReminder(to: string, businessName: string, daysLeft: number, endDate: string): Promise<boolean> {
    return this.send({
      to,
      subject: `Subscription expiring in ${daysLeft} days — renew now`,
      html: `
        <h2>Subscription Expiring Soon</h2>
        <p>Hi ${businessName} team,</p>
        <p>Your subscription will expire on <strong>${endDate}</strong> (${daysLeft} days remaining).</p>
        <p>Renew now to keep your Verified badge, priority placement, and ad credits active.</p>
      `,
    });
  }

  async sendNewReviewNotification(to: string, businessName: string, reviewAuthor: string, rating: number): Promise<boolean> {
    return this.send({
      to,
      subject: `New ${rating}-star review on ${businessName}`,
      html: `
        <h2>New Review</h2>
        <p>${reviewAuthor} left a ${rating}-star review on your listing.</p>
        <p>Log in to your dashboard to respond.</p>
      `,
    });
  }

  async sendLeadNotification(to: string, businessName: string, leadName: string, leadPhone: string, message: string): Promise<boolean> {
    return this.send({
      to,
      subject: `New enquiry for ${businessName} from ${leadName}`,
      html: `
        <h2>New Customer Enquiry</h2>
        <p><strong>Name:</strong> ${leadName}</p>
        <p><strong>Phone:</strong> ${leadPhone}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Contact them quickly — fast responses get more business!</p>
      `,
    });
  }

  async sendSupportReply(to: string, ticketSubject: string, reply: string): Promise<boolean> {
    return this.send({
      to,
      subject: `Re: ${ticketSubject}`,
      html: `
        <h2>Support Reply</h2>
        <p>${reply}</p>
        <p>Need more help? Reply to this email.</p>
      `,
    });
  }
}

export const emailService = new EmailService();
