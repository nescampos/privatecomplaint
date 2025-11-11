'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OldSubmitPage() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to the new dashboard submit page
		router.push('/dashboard/submit');
	}, [router]);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="text-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
				<p className="mt-4 text-sm text-gray-600">Redirecting to submission page...</p>
			</div>
		</div>
	);
}