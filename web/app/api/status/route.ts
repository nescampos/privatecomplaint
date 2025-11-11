import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';

export async function GET(request: NextRequest) {
  const contractInitialized = fs.existsSync('deployment.json');
  
  // For wallet connection status, we'd need to check if a wallet seed exists
  const walletConnected = !!process.env.WALLET_SEED;

  return NextResponse.json({
    status: 'ok',
    contractInitialized,
    walletConnected,
  });
}