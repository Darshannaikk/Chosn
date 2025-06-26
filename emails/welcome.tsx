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

interface WelcomeEmailProps {
  name: string;
  userType: 'developer' | 'company';
  appName: string;
}

export const WelcomeEmail = ({
  name,
  userType,
  appName,
}: WelcomeEmailProps) => {
  const previewText = `Welcome to ${appName} - ${
    userType === 'developer' 
      ? "Let's showcase your skills!" 
      : "Find top developer talent!"
  }`;

  const steps = userType === 'developer' 
    ? [
        'Complete your profile with your skills and experience',
        'Connect your GitHub to validate your expertise',
        'Get discovered by top companies looking for your skills',
      ]
    : [
        'Set up your company profile',
        'Browse verified developer profiles',
        'Send messages to developers you\'re interested in',
      ];

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
          
          <Heading style={h1}>Welcome to {appName}, {name}! 🎉</Heading>
          
          <Text style={text}>
            {userType === 'developer' 
              ? "You're now part of an exclusive community where skills speak louder than resumes."
              : "You're now connected to a curated network of verified developer talent."
            }
          </Text>
          
          <Section style={highlightBox}>
            <Text style={highlightText}>
              <strong>Our motto:</strong> Don't apply, get applied.
            </Text>
          </Section>
          
          <Text style={subheading}>Here's how to get started:</Text>
          
          <Section style={stepsContainer}>
            {steps.map((step, index) => (
              <Text key={index} style={stepItem}>
                <span style={stepNumber}>{index + 1}</span> {step}
              </Text>
            ))}
          </Section>
          
          <Section style={buttonContainer}>
            <Button 
              style={button} 
              href={userType === 'developer' ? 'https://chosn.dev/profile' : 'https://chosn.dev/companies/dashboard'}
            >
              {userType === 'developer' ? 'Complete Your Profile' : 'Browse Developers'}
            </Button>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={helpText}>
            Need help? Check out our{' '}
            <Link href="https://chosn.dev/help" style={link}>
              getting started guide
            </Link>{' '}
            or reply to this email - we're here to help!
          </Text>
          
          <Text style={footer}>
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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

const subheading = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'left' as const,
  marginTop: '32px',
  marginBottom: '16px',
  paddingLeft: '20px',
  paddingRight: '20px',
};

const highlightBox = {
  backgroundColor: '#f8f9fa',
  borderLeft: '4px solid #5469d4',
  margin: '20px',
  padding: '16px',
};

const highlightText = {
  color: '#333',
  fontSize: '16px',
  margin: '0',
};

const stepsContainer = {
  paddingLeft: '20px',
  paddingRight: '20px',
  marginBottom: '32px',
};

const stepItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '28px',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'flex-start',
};

const stepNumber = {
  backgroundColor: '#5469d4',
  borderRadius: '50%',
  color: '#fff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 'bold',
  height: '24px',
  lineHeight: '24px',
  marginRight: '12px',
  textAlign: 'center' as const,
  width: '24px',
  flexShrink: 0,
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