'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ReportItem {
	id: string;
	institution_name: string;
	institution_type: 'PUBLIC' | 'PRIVATE';
	report_details: string;
	timestamp: number;
}

export default function ReportsPage() {
	const [reports, setReports] = useState<ReportItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchReports = async () => {
			try {
				const res = await fetch('/api/reports', { cache: 'no-store' });
				if (!res.ok) throw new Error('Failed to fetch reports');
				const data = await res.json();
				setReports(data.reports ?? []);
			} catch (e: any) {
				setError(e.message ?? 'Unknown error');
			} finally {
				setLoading(false);
			}
		};
		fetchReports();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-24 text-gray-600 text-sm">
				Loading reports...
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white border rounded-lg p-6">
				<h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
				<p className="text-sm text-gray-600 mb-4">{error}</p>
				<button
					className="px-3 py-2 text-sm rounded bg-blue-600 text-white"
					onClick={() => location.reload()}
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Reports</h1>
					<p className="text-sm text-gray-500">Browse recently submitted complaints</p>
				</div>
				<Link
					href="/submit"
					className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					Submit a report
				</Link>
			</div>

			<div className="bg-white border rounded-lg overflow-hidden">
				<div className="divide-y">
					{reports.length === 0 ? (
						<div className="p-8 text-center text-sm text-gray-500">
							No reports yet.
						</div>
					) : (
						reports.map((r) => (
							<div key={r.id} className="p-6 hover:bg-gray-50 transition-colors">
								<div className="flex items-start justify-between gap-4">
									<div>
										<div className="flex items-center gap-2">
											<h3 className="text-base font-semibold">{r.institution_name}</h3>
											<span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
												{r.institution_type}
											</span>
										</div>
										<p className="mt-1 text-sm text-gray-600 line-clamp-3">{r.report_details}</p>
									</div>
									<div className="text-right text-xs text-gray-500 whitespace-nowrap">
										{new Date(r.timestamp * 1000).toLocaleString()}
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

