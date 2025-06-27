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

interface MatchInterestEmailProps {
  recipientName: string;
  interestedUserName: string;
  interestedUserType: 'developer' | 'company';
  profileUrl: string;
  appName: string;
}

export const MatchInterestEmail = ({
  recipientName,
  interestedUserName,
  interestedUserType,
  profileUrl,
  appName,
}: MatchInterestEmailProps) => {
  const previewText = `${interestedUserName} is interested in ${
    interestedUserType === 'company' ? 'your profile' : 'working with you'
  }!`;

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
            <Text style={emoji}>🎉</Text>
          </Section>
          
          <Heading style={h1}>Someone's interested!</Heading>
          
          <Text style={text}>Hi {recipientName},</Text>
          
          <Text style={text}>
            Great news! <strong>{interestedUserName}</strong> has shown interest in{' '}
            {interestedUserType === 'company' ? 'your developer profile' : 'working with your company'}.
          </Text>
          
          <Text style={text}>
            This could be the start of something amazing. Check out their profile and see if it's a good match!
          </Text>
          
          <Section style={buttonContainer}>
            <Button style={button} href={profileUrl}>
              View Profile
            </Button>
          </Section>
          
          <Text style={tipText}>
            💡 <strong>Pro tip:</strong> Profiles with quick response times get 3x more matches!
          </Text>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            You're receiving this email because you have match notifications enabled.
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

export default MatchInterestEmail;

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

const tipText = {
  backgroundColor: '#f0f9ff',
  border: '1px solid #e0f2fe',
  borderRadius: '8px',
  color: '#0369a1',
  fontSize: '14px',
  lineHeight: '20px',
  padding: '16px',
  margin: '20px',
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