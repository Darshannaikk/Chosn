import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/email';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    let result;

    switch (type) {
      case 'new-message':
        result = await emailService.sendNewMessageNotification(data);
        break;
      case 'match-interest':
        result = await emailService.sendMatchInterestNotification(data);
        break;
      case 'welcome':
        result = await emailService.sendWelcomeEmail(data);
        break;
      case 'subscription':
        result = await emailService.sendSubscriptionEmail(data);
        break;
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Error in email API:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 