import { NextRequest, NextResponse } from 'next/server';
import { getReport } from '../../../../utils/contract';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reportId = parseInt(params.id);

    const report = await getReport(reportId);

    return NextResponse.json({ report });
  } catch (error: any) {
    console.error('Error getting report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}