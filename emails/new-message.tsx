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

interface NewMessageEmailProps {
  recipientName: string;
  senderName: string;
  messagePreview: string;
  conversationUrl: string;
  appName: string;
}

export const NewMessageEmail = ({
  recipientName,
  senderName,
  messagePreview,
  conversationUrl,
  appName,
}: NewMessageEmailProps) => {
  const previewText = `${senderName} sent you a message on ${appName}`;

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
          
          <Heading style={h1}>New message from {senderName}</Heading>
          
          <Text style={text}>Hi {recipientName},</Text>
          
          <Text style={text}>
            You have a new message on {appName}:
          </Text>
          
          <Section style={messageBox}>
            <Text style={messageText}>"{messagePreview}"</Text>
          </Section>
          
          <Section style={buttonContainer}>
            <Button style={button} href={conversationUrl}>
              View Conversation
            </Button>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            You're receiving this email because you have message notifications enabled.
            You can update your notification preferences in your{' '}
            <Link href="https://chosn.dev/settings" style={link}>
              account settings
            </Link>
            .
          </Text>
          
          <Text style={footer}>
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default NewMessageEmail;

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

const messageBox = {
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  padding: '24px',
  margin: '20px',
};

const messageText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  fontStyle: 'italic',
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