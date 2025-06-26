import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface SubscriptionEmailProps {
  name: string;
  action: 'created' | 'updated' | 'cancelled' | 'expired';
  planName: string;
  nextBillingDate?: string;
  amount?: string;
  manageUrl: string;
  appName: string;
}

export const SubscriptionEmail = ({
  name,
  action,
  planName,
  nextBillingDate,
  amount,
  manageUrl,
  appName,
}: SubscriptionEmailProps) => {
  const getContent = () => {
    switch (action) {
      case 'created':
        return {
          emoji: '🎊',
          heading: `Welcome to ${planName}!`,
          message: `Your subscription is now active. You have full access to all ${planName} features.`,
          buttonText: 'Explore Features',
        };
      case 'updated':
        return {
          emoji: '✨',
          heading: 'Subscription Updated',
          message: `Your subscription has been successfully updated to ${planName}.`,
          buttonText: 'View Changes',
        };
      case 'cancelled':
        return {
          emoji: '👋',
          heading: 'Subscription Cancelled',
          message: `Your ${planName} subscription has been cancelled. You'll continue to have access until the end of your billing period.`,
          buttonText: 'Reactivate Subscription',
        };
      case 'expired':
        return {
          emoji: '⏰',
          heading: 'Subscription Expired',
          message: `Your ${planName} subscription has expired. Renew now to continue accessing premium features.`,
          buttonText: 'Renew Subscription',
        };
    }
  };

  const content = getContent();
  const previewText = content.heading;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://chosn.dev/logo.png"
            width="48"
            height="48"
            alt={appName}
            style={logo}
          />
          
          <Section style={iconSection}>
            <Text style={emoji}>{content.emoji}</Text>
          </Section>
          
          <Heading style={h1}>{content.heading}</Heading>
          
          <Text style={text}>Hi {name},</Text>
          
          <Text style={text}>{content.message}</Text>
          
          {(action === 'created' || action === 'updated') && nextBillingDate && amount && (
            <Section style={infoBox}>
              <Text style={infoTitle}>Subscription Details:</Text>
              <Text style={infoItem}>
                <strong>Plan:</strong> {planName}
              </Text>
              <Text style={infoItem}>
                <strong>Amount:</strong> {amount}
              </Text>
              <Text style={infoItem}>
                <strong>Next billing date:</strong> {nextBillingDate}
              </Text>
            </Section>
          )}
          
          <Section style={buttonContainer}>
            <Button style={button} href={manageUrl}>
              {content.buttonText}
            </Button>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={helpText}>
            Have questions about your subscription?{' '}
            <Link href="https://chosn.dev/help/billing" style={link}>
              Visit our billing FAQ
            </Link>{' '}
            or reply to this email.
          </Text>
          
          <Text style={footer}>
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default SubscriptionEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '24px',
  display: 'block',
};

const iconSection = {
  textAlign: 'center' as const,
  marginTop: '20px',
  marginBottom: '10px',
};

const emoji = {
  fontSize: '48px',
  margin: '0',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'left' as const,
  marginBottom: '12px',
  paddingLeft: '20px',
  paddingRight: '20px',
};

const infoBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  margin: '20px',
  padding: '20px',
};

const infoTitle = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '12px',
};

const infoItem = {
  color: '#555',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '8px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const helpText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '12px',
};

const link = {
  color: '#5469d4',
  textDecoration: 'underline',
}; 