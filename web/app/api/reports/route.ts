import { NextRequest, NextResponse } from 'next/server';
import { submitReport } from '../../utils/contract';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { institution_name, report_details, institution_type, timestamp } = body;

    const result = await submitReport(
      institution_name,
      report_details,
      institution_type,
      timestamp || Math.floor(Date.now() / 1000)
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error submitting report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // This would query the contract's report list
    // For now, returning an empty array since direct ledger queries might be limited
    return NextResponse.json({ reports: [] });
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}