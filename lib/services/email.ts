import { Resend } from 'resend';
import { render } from '@react-email/render';

// Email templates
import { NewMessageEmail } from '@/lib/new-message';
import { MatchInterestEmail } from '@/lib/match-interest';
import { WelcomeEmail } from '@/lib/welcome';
import { SubscriptionEmail } from '@/lib/subscription';

export interface EmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
  from?: string;
}

export interface NotificationPreferences {
  newMessages: boolean;
  matchInterest: boolean;
  weeklyDigest: boolean;
  platformUpdates: boolean;
}

class EmailService {
  private readonly fromEmail = process.env.EMAIL_FROM || 'noreply@chosn.dev';
  private readonly appName = 'Chosn';
  private resend: Resend | null = null;

  private getResendClient(): Resend {
    if (!this.resend) {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        console.warn('RESEND_API_KEY not found. Email service will not function.');
        // Return a mock client for development/build time
        return {
          emails: {
            send: async () => {
              console.log('Mock email send - Resend API key not configured');
              return { data: { id: 'mock-email' }, error: null };
            }
          }
        } as any;
      }
      this.resend = new Resend(apiKey);
    }
    return this.resend;
  }

  async sendEmail({ to, subject, react, from }: EmailOptions) {
    try {
      const resend = this.getResendClient();
      const html = render(react);
      
      const { data, error } = await resend.emails.send({
        from: from || `${this.appName} <${this.fromEmail}>`,
        to,
        subject,
        html,
      });

      if (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Exception sending email:', error);
      return { success: false, error };
    }
  }

  // Notification methods
  async sendNewMessageNotification({
    recipientEmail,
    recipientName,
    senderName,
    messagePreview,
    conversationUrl,
  }: {
    recipientEmail: string;
    recipientName: string;
    senderName: string;
    messagePreview: string;
    conversationUrl: string;
  }) {
    return this.sendEmail({
      to: recipientEmail,
      subject: `New message from ${senderName} on ${this.appName}`,
      react: NewMessageEmail({
        recipientName,
        senderName,
        messagePreview,
        conversationUrl,
        appName: this.appName,
      }),
    });
  }

  async sendMatchInterestNotification({
    recipientEmail,
    recipientName,
    interestedUserName,
    interestedUserType,
    profileUrl,
  }: {
    recipientEmail: string;
    recipientName: string;
    interestedUserName: string;
    interestedUserType: 'developer' | 'company';
    profileUrl: string;
  }) {
    const subject = interestedUserType === 'company' 
      ? `${interestedUserName} is interested in your profile!`
      : `${interestedUserName} is interested in working with you!`;

    return this.sendEmail({
      to: recipientEmail,
      subject,
      react: MatchInterestEmail({
        recipientName,
        interestedUserName,
        interestedUserType,
        profileUrl,
        appName: this.appName,
      }),
    });
  }

  async sendWelcomeEmail({
    email,
    name,
    userType,
  }: {
    email: string;
    name: string;
    userType: 'developer' | 'company';
  }) {
    const subject = userType === 'developer'
      ? `Welcome to ${this.appName} - Let's showcase your skills!`
      : `Welcome to ${this.appName} - Find top developer talent!`;

    return this.sendEmail({
      to: email,
      subject,
      react: WelcomeEmail({
        name,
        userType,
        appName: this.appName,
      }),
    });
  }

  async sendSubscriptionEmail({
    email,
    name,
    action,
    planName,
    nextBillingDate,
    amount,
    manageUrl,
  }: {
    email: string;
    name: string;
    action: 'created' | 'updated' | 'cancelled' | 'expired';
    planName: string;
    nextBillingDate?: string;
    amount?: string;
    manageUrl: string;
  }) {
    const subjects = {
      created: `Welcome to ${this.appName} ${planName}!`,
      updated: `Your ${this.appName} subscription has been updated`,
      cancelled: `Your ${this.appName} subscription has been cancelled`,
      expired: `Your ${this.appName} subscription has expired`,
    };

    return this.sendEmail({
      to: email,
      subject: subjects[action],
      react: SubscriptionEmail({
        name,
        action,
        planName,
        nextBillingDate,
        amount,
        manageUrl,
        appName: this.appName,
      }),
    });
  }

  // Batch email sending for digests
  async sendWeeklyDigest({
    developers,
    companies,
  }: {
    developers: Array<{
      email: string;
      name: string;
      newMatches: number;
      profileViews: number;
      unreadMessages: number;
    }>;
    companies: Array<{
      email: string;
      name: string;
      newDevelopers: number;
      responseRate: number;
      activeConversations: number;
    }>;
  }) {
    // Implementation for weekly digest emails
    // This would be called by a cron job
    console.log('Sending weekly digests...');
    // TODO: Implement batch sending
  }
}

export const emailService = new EmailService(); 