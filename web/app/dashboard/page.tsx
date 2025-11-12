'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardData {
  totalReports: number;
  openReports: number;
  closedReports: number;
  pendingFeedback: number;
  walletAddress: string;
  balance: string;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportForm, setReportForm] = useState({
    institution_name: '',
    report_details: '',
    institution_type: 'PUBLIC'
  });
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reports/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reportForm,
          timestamp: Math.floor(Date.now() / 1000)
        }),
      });

      if (response.ok) {
        alert('Report submitted successfully!');
        setReportForm({
          institution_name: '',
          report_details: '',
          institution_type: 'PUBLIC'
        });
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to submit report'}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message || 'Failed to submit report'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="bg-white p-6 rounded-lg border max-w-md w-full">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of activity and quick actions</p>
        </div>
        <div className="text-xs text-gray-500 text-right">
          {dashboardData?.walletAddress && (
            <div>
              <p>
                Wallet: {dashboardData.walletAddress.substring(0, 8)}...
                {dashboardData.walletAddress.substring(dashboardData.walletAddress.length - 4)}
              </p>
              <p>Balance: {dashboardData.balance} DUST</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border rounded-lg shadow-sm">
          <div className="px-4 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-50 rounded-md p-2">
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-medium text-gray-500 truncate">Total Reports</dt>
                  <dd className="flex items-baseline">
                    <div className="text-xl font-semibold text-gray-900">{dashboardData?.totalReports || 0}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

      </div>


      {/* Recent Reports */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="px-4 py-4 border-b">
          <h3 className="text-base font-semibold text-gray-900">Recent Reports</h3>
          <p className="mt-1 text-sm text-gray-500">List of recently submitted reports</p>
        </div>
        <div className="px-4 py-4">
          <p className="text-sm text-gray-500">No reports available yet. Submit a new report above.</p>
        </div>
      </div>
    </div>
  );
}