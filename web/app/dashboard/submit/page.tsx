'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../../lib/wallet-context';

export default function SubmitPage() {
	const router = useRouter();
	const { connected } = useWallet();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [form, setForm] = useState({
		institution_name: '',
		institution_type: 'PUBLIC',
		report_details: '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Verificar si la wallet está conectada antes de enviar
		if (!connected) {
			setError('Please connect your wallet before submitting a report.');
			return;
		}
		
		setIsSubmitting(true);
		setError(null);
		try {
			const res = await fetch('/api/reports/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...form,
					timestamp: Math.floor(Date.now() / 1000),
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Submission failed');
			router.push('/dashboard/reports');
		} catch (e: any) {
			setError(e.message ?? 'Unknown error');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-2xl">
			<h1 className="text-2xl font-bold tracking-tight text-gray-800">Submit a report</h1>
			<p className="text-sm text-gray-500 mb-6">File an anonymous complaint.</p>

			<form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-5 shadow-sm">
				{error && (
					<div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
						{error}
					</div>
				)}

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Institution name
					</label>
					<input
						type="text"
						required
						value={form.institution_name}
						onChange={(e) => setForm({ ...form, institution_name: e.target.value })}
						className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
						placeholder="e.g., City Hall"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Institution type
					</label>
					<select
						value={form.institution_type}
						onChange={(e) => setForm({ ...form, institution_type: e.target.value })}
						className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
					>
						<option value="PUBLIC">Public</option>
						<option value="PRIVATE">Private</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Report details
					</label>
					<textarea
						required
						rows={5}
						value={form.report_details}
						onChange={(e) => setForm({ ...form, report_details: e.target.value })}
						className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
						placeholder="Describe the incident with as much detail as possible."
					/>
					<p className="mt-2 text-xs text-gray-500">Do not include personal identifiable information.</p>
				</div>

				{!connected && (
					<div className="mb-4 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-3">
						Please connect your wallet to submit a report.
					</div>
				)}
				<button
					type="submit"
					disabled={isSubmitting || !connected}
					className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
						connected && !isSubmitting 
							? 'bg-blue-600 hover:bg-blue-700' 
							: 'bg-gray-400 cursor-not-allowed'
					}`}
				>
					{isSubmitting ? 'Submitting...' : 'Submit report'}
				</button>
			</form>
		</div>
	);
}