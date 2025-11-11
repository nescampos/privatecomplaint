import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const deploymentPath = path.join(process.cwd(), 'deployment.json');
    
    if (fs.existsSync(deploymentPath)) {
      const deploymentData = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'));
      return NextResponse.json(deploymentData);
    } else {
      return NextResponse.json(
        { error: 'Deployment file not found. Please deploy the contract first.' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error reading deployment file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}