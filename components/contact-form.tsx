'use client';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { cn } from '@/lib/utils';
import { IQuestionRequest } from '@/lib/models/questionRequest';
import { handleQuestionForm } from '@/lib/db/notion';
import { useToast } from './ui/use-toast';

export function ContactForm() {
	const [form, setForm] = useState<IQuestionRequest>({
		firstName: '',
		lastName: '',
		organization: '',
		email: '',
		question: '',
	});

	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (await handleQuestionForm(form)) {
			toast({
				title: 'Question successfully submitted!',
			});
		} else {
			toast({
				title: 'Error submitting question',
				description: 'error',
			});
		}
	};
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setForm({ ...form, [e.target.id]: e.target.value });
	};

	return (
		<div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black">
			<h2 className="font-bold text-xl text-neutral-200">Ask Me a Question</h2>

			<form className="my-8" onSubmit={handleSubmit}>
				<div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
					<LabelInputContainer>
						<Label htmlFor="firstName">First name</Label>
						<Input
							id="firstName"
							placeholder="Tyler"
							type="text"
							onChange={handleChange}
						/>
					</LabelInputContainer>
					<LabelInputContainer>
						<Label htmlFor="lastName">Last name</Label>
						<Input
							id="lastName"
							placeholder="Durden"
							type="text"
							onChange={handleChange}
						/>
					</LabelInputContainer>
					<LabelInputContainer>
						<Label htmlFor="organization">Organization</Label>
						<Input
							id="organization"
							placeholder="School/Company etc"
							type="text"
							onChange={handleChange}
						/>
					</LabelInputContainer>
				</div>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="email">Email Address</Label>
					<Input
						id="email"
						placeholder="projectmayhem@fc.com"
						type="email"
						onChange={handleChange}
					/>
				</LabelInputContainer>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="question">Question</Label>
					<Textarea
						id="question"
						placeholder="Your question"
						onChange={handleChange}
					/>
				</LabelInputContainer>

				<button
					className="relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md font-medium  shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
					type="submit"
				>
					🙋 &rarr;
					<BottomGradient />
				</button>

				<div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

				<div className="flex flex-col space-y-4"></div>
			</form>
		</div>
	);
}

const BottomGradient = () => {
	return (
		<>
			<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
			<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
		</>
	);
};

const LabelInputContainer = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn('flex flex-col space-y-2 w-full', className)}>
			{children}
		</div>
	);
};
