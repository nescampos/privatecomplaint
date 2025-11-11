import { NextRequest, NextResponse } from 'next/server';
import { updateCaseStatus } from '../../../utils/contract';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { report_id, new_status } = body;

    const result = await updateCaseStatus(report_id, new_status);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error updating case status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}