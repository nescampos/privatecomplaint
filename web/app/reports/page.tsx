'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OldReportsPage() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to the new dashboard reports page
		router.push('/dashboard/reports');
	}, [router]);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="text-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
				<p className="mt-4 text-sm text-gray-600">Redirecting to reports page...</p>
			</div>
		</div>
	);
}