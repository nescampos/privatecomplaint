import { NextRequest, NextResponse } from 'next/server';
import { sendFeedback } from '../../../utils/contract';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { report_id, feedback_message } = body;

    const result = await sendFeedback(report_id, feedback_message);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error sending feedback:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}