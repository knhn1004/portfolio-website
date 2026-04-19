'use client';

import {
	type CSSProperties,
	type ChangeEvent,
	type FormEvent,
	useCallback,
	useMemo,
	useState,
} from 'react';
import { useReCaptcha } from 'next-recaptcha-v3';
import { handleQuestionForm } from '@/lib/db/notion';
import type { IQuestionRequest } from '@/lib/models/questionRequest';
import { useToast } from '@/components/ui/use-toast';
import { Button } from './primitives';

function Field({
	label,
	id,
	value,
	onChange,
	placeholder,
	type = 'text',
	textarea = false,
	required = false,
}: {
	label: string;
	id: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	placeholder?: string;
	type?: string;
	textarea?: boolean;
	required?: boolean;
}) {
	const [focus, setFocus] = useState(false);
	const common: CSSProperties = {
		width: '100%',
		padding: '10px 0',
		fontFamily: 'var(--font-sans)',
		fontSize: 16,
		background: 'transparent',
		border: 'none',
		borderBottom: `1px solid ${focus ? 'var(--ink)' : 'var(--rule)'}`,
		outline: 'none',
		color: 'var(--ink)',
		transition: 'border-color 140ms var(--ease-out)',
	};
	return (
		<label
			style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
			htmlFor={id}
		>
			<span className="eyebrow">{label}</span>
			{textarea ? (
				<textarea
					id={id}
					rows={4}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					onFocus={() => setFocus(true)}
					onBlur={() => setFocus(false)}
					required={required}
					style={{ ...common, resize: 'vertical', minHeight: 100 }}
				/>
			) : (
				<input
					id={id}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					onFocus={() => setFocus(true)}
					onBlur={() => setFocus(false)}
					required={required}
					style={common}
				/>
			)}
		</label>
	);
}

export function ContactForm() {
	const emptyForm: IQuestionRequest = useMemo(
		() => ({
			firstName: '',
			lastName: '',
			organization: '',
			email: '',
			question: '',
		}),
		[]
	);
	const [form, setForm] = useState<IQuestionRequest>({ ...emptyForm });
	const [sending, setSending] = useState(false);
	const [sent, setSent] = useState(false);
	const { toast } = useToast();
	const { executeRecaptcha } = useReCaptcha();

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => setForm(f => ({ ...f, [e.target.id]: e.target.value }));

	const handleSubmit = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setSending(true);
			try {
				const token = await executeRecaptcha('question_form');
				const result = await handleQuestionForm({ ...form, token });
				if (result.ok) {
					toast({ title: "Message sent. I'll be in touch." });
					setForm({ ...emptyForm });
					setSent(true);
				} else if (result.reason === 'rate_limited') {
					toast({
						title: 'Too many submissions',
						description:
							'Please wait a bit before sending again, or email directly.',
					});
				} else if (result.reason === 'recaptcha') {
					toast({
						title: 'Verification failed',
						description: 'reCAPTCHA didn’t pass — try again.',
					});
				} else if (result.reason === 'invalid') {
					toast({
						title: 'Missing fields',
						description: 'Please fill every field and try again.',
					});
				} else {
					toast({
						title: 'Could not send',
						description: 'Please try again or email directly.',
					});
				}
			} finally {
				setSending(false);
			}
		},
		[executeRecaptcha, form, emptyForm, toast]
	);

	return (
		<>
			<p
				style={{
					fontFamily: 'var(--font-display)',
					fontSize: 22,
					color: 'var(--ink-3)',
					fontStyle: 'italic',
					marginTop: 0,
					marginBottom: 48,
					maxWidth: 680,
				}}
			>
				Drop a short note — collaboration, research, a question about the
				work. I read everything that comes in.
			</p>

			<div
				className="oc-contact-grid"
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 340px',
					gap: 64,
					alignItems: 'start',
				}}
			>
				<form
					onSubmit={handleSubmit}
					style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
				>
					<div
						className="oc-contact-row"
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr 1fr',
							gap: 24,
						}}
					>
						<Field
							id="firstName"
							label="First name"
							value={form.firstName}
							onChange={handleChange}
							placeholder="Ada"
							required
						/>
						<Field
							id="lastName"
							label="Last name"
							value={form.lastName}
							onChange={handleChange}
							placeholder="Lovelace"
							required
						/>
						<Field
							id="organization"
							label="Organization"
							value={form.organization}
							onChange={handleChange}
							placeholder="Lab, school, or company"
							required
						/>
					</div>
					<Field
						id="email"
						label="Email"
						type="email"
						value={form.email}
						onChange={handleChange}
						placeholder="you@domain.com"
						required
					/>
					<Field
						id="question"
						label="Message"
						textarea
						value={form.question}
						onChange={handleChange}
						placeholder="A short description of what you'd like to discuss."
						required
					/>
					<div
						style={{
							display: 'flex',
							gap: 14,
							alignItems: 'center',
							marginTop: 8,
							flexWrap: 'wrap',
						}}
					>
						<Button type="submit" disabled={sending}>
							{sending ? 'Sending…' : sent ? 'Sent ✓' : 'Send message'}{' '}
							<span>→</span>
						</Button>
						<span className="mono-xs">Protected by reCAPTCHA</span>
					</div>
				</form>

				<aside
					className="oc-contact-aside"
					style={{
						borderLeft: '1px solid var(--rule)',
						paddingLeft: 28,
					}}
				>
					<div className="eyebrow" style={{ marginBottom: 14 }}>
						Direct
					</div>
					<div
						className="mono"
						style={{
							color: 'var(--ink)',
							marginBottom: 24,
							fontSize: 14,
						}}
					>
						Fill the form — it reaches me the same way.
					</div>

					<div className="eyebrow" style={{ marginBottom: 14 }}>
						Expect
					</div>
					<div className="body-sm">
						A real reply, not a templated one. I&rsquo;ll either engage or tell
						you honestly that I can&rsquo;t right now.
					</div>
				</aside>
			</div>

			<style jsx>{`
				@media (max-width: 820px) {
					:global(.oc-contact-grid) {
						grid-template-columns: 1fr !important;
						gap: 32px !important;
					}
					:global(.oc-contact-aside) {
						border-left: 0 !important;
						border-top: 1px solid var(--rule) !important;
						padding-left: 0 !important;
						padding-top: 24px !important;
					}
					:global(.oc-contact-row) {
						grid-template-columns: 1fr !important;
					}
				}
			`}</style>
		</>
	);
}
