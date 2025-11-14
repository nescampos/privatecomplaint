'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../../lib/wallet-context';

export default function VerificationPage() {
  const router = useRouter();
  const { connected } = useWallet();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [reportId, setReportId] = useState<string>('');
  
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify if wallet is connected before submitting
    if (!connected) {
      setError('Please connect your wallet before verifying report ownership.');
      return;
    }

    if (!reportId || isNaN(Number(reportId))) {
      setError('Please enter a valid report ID.');
      return;
    }

    setIsVerifying(true);
    setSuccess(null);
    setError(null);
    
    try {
      const res = await fetch('/api/contralor/validate-informer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_id: parseInt(reportId),
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      
      if (data.isValid) {
        setSuccess(true);
      } else {
        setSuccess(false);
        setError('You are not the owner of this report.');
      }
    } catch (e: any) {
      setSuccess(false);
      setError(e.message ?? 'Unknown error during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-800">Verify Report Ownership</h1>
      <p className="text-sm text-gray-500 mb-6">Validate that you are the original reporter of a specific complaint.</p>

      <form onSubmit={handleVerification} className="bg-white border rounded-lg p-6 space-y-5 shadow-sm">
        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
            {error}
          </div>
        )}

        {success === true && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">
            <div className="font-medium">✓ Verification Successful</div>
            <p>You have been verified as the owner of this report.</p>
          </div>
        )}

        <div>
          <label htmlFor="reportId" className="block text-sm font-medium text-gray-700">
            Report ID
          </label>
          <input
            type="number"
            id="reportId"
            required
            value={reportId}
            onChange={(e) => setReportId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter the report ID"
            min="1"
          />
          <p className="mt-2 text-xs text-gray-500">The unique identifier of the report you want to verify ownership for.</p>
        </div>

        {!connected && (
          <div className="mb-4 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-3">
            Please connect your wallet to verify report ownership.
          </div>
        )}
        
        <button
          type="submit"
          disabled={isVerifying || !connected}
          className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-black disabled:opacity-60 ${
            connected && !isVerifying
              ? 'bg-blue-200 hover:bg-blue-300'
              : 'bg-gray-200 cursor-not-allowed'
          }`}
        >
          {isVerifying ? 'Verifying...' : 'Verify Ownership'}
        </button>
        
        {success === false && (
          <div className="text-sm text-gray-600 mt-4">
            <p className="font-medium">What does this mean?</p>
            <p className="mt-1">
              If you believe you should be the owner of this report, please double-check:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
              <li>The Report ID is correct</li>
              <li>You are signed in with the same wallet used to submit the report</li>
              <li>The report was submitted from this device (required for verification)</li>
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}