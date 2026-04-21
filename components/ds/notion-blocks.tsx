// Lightweight renderer for the subset of Notion blocks we actually use in
// project case studies and blog posts. Unknown block types are skipped
// rather than thrown so a new block type in Notion never takes a page down.

import type { CSSProperties, ReactNode } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { codeToHast, type BundledLanguage } from 'shiki';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import type { INotionBlock } from '@/lib/db/notion';

type RichText = {
	plain_text: string;
	annotations?: {
		bold?: boolean;
		italic?: boolean;
		strikethrough?: boolean;
		underline?: boolean;
		code?: boolean;
		color?: string;
	};
	href?: string | null;
};

function RichTextRun({ run, index }: { run: RichText; index: number }) {
	const a = run.annotations ?? {};
	const style: CSSProperties = {};
	if (a.color && a.color !== 'default') {
		// Notion "red"/"red_background" etc. — map to accent for emphasis.
		if (a.color.endsWith('_background')) {
			style.background = 'var(--accent-soft)';
			style.padding = '0 4px';
		} else {
			style.color = 'var(--accent)';
		}
	}
	if (a.strikethrough) style.textDecorationLine = 'line-through';
	if (a.underline) {
		style.textDecorationLine = a.strikethrough
			? 'line-through underline'
			: 'underline';
	}

	let node: ReactNode = run.plain_text;
	if (a.code)
		node = (
			<code
				className="mono"
				style={{
					background: 'var(--paper-2)',
					padding: '2px 6px',
					border: '1px solid var(--rule-soft)',
					fontSize: '0.88em',
				}}
			>
				{node}
			</code>
		);
	if (a.bold) node = <strong style={{ color: 'var(--ink)' }}>{node}</strong>;
	if (a.italic) node = <em>{node}</em>;

	if (run.href) {
		return (
			<a
				key={index}
				href={run.href}
				target="_blank"
				rel="noopener noreferrer"
				style={{
					...style,
					color: 'var(--ink)',
					textDecorationLine: 'underline',
					textDecorationColor: 'var(--rule)',
					textUnderlineOffset: 3,
				}}
			>
				{node}
			</a>
		);
	}
	return (
		<span key={index} style={style}>
			{node}
		</span>
	);
}

function renderRichText(rt: RichText[] | undefined): ReactNode {
	if (!rt || !rt.length) return null;
	return rt.map((r, i) => <RichTextRun key={i} run={r} index={i} />);
}

function Paragraph({ block }: { block: INotionBlock }) {
	const rt = block.data.rich_text as RichText[];
	return (
		<p
			style={{
				fontFamily: 'var(--font-sans)',
				fontSize: 18,
				lineHeight: 1.7,
				color: 'var(--ink-2)',
				margin: '0 0 1.1em',
			}}
		>
			{renderRichText(rt) || '\u00A0'}
		</p>
	);
}

function Heading({
	block,
	level,
}: {
	block: INotionBlock;
	level: 1 | 2 | 3;
}) {
	const Tag = level === 1 ? 'h2' : level === 2 ? 'h3' : 'h4';
	const size = level === 1 ? 36 : level === 2 ? 28 : 22;
	return (
		<Tag
			style={{
				fontFamily: 'var(--font-display)',
				fontSize: size,
				lineHeight: 1.2,
				letterSpacing: '-0.01em',
				color: 'var(--ink)',
				fontWeight: 400,
				margin: '1.8em 0 0.4em',
			}}
		>
			{renderRichText(block.data.rich_text)}
		</Tag>
	);
}

function BulletedList({ items }: { items: INotionBlock[] }) {
	return (
		<ul
			style={{
				paddingLeft: 24,
				margin: '0 0 1.1em',
				color: 'var(--ink-2)',
				fontSize: 18,
				lineHeight: 1.7,
			}}
		>
			{items.map(b => (
				<li key={b.id} style={{ marginBottom: 6 }}>
					{renderRichText(b.data.rich_text)}
					{b.children.length > 0 && <Blocks blocks={b.children} />}
				</li>
			))}
		</ul>
	);
}

function NumberedList({ items }: { items: INotionBlock[] }) {
	return (
		<ol
			style={{
				paddingLeft: 28,
				margin: '0 0 1.1em',
				color: 'var(--ink-2)',
				fontSize: 18,
				lineHeight: 1.7,
			}}
		>
			{items.map(b => (
				<li key={b.id} style={{ marginBottom: 6 }}>
					{renderRichText(b.data.rich_text)}
					{b.children.length > 0 && <Blocks blocks={b.children} />}
				</li>
			))}
		</ol>
	);
}

// Notion's code block `language` field uses human names ("javascript", "plain text").
// Map the ones that don't match a shiki bundled id; the rest pass through.
const NOTION_TO_SHIKI_LANG: Record<string, BundledLanguage | 'text'> = {
	'plain text': 'text',
	plaintext: 'text',
	'': 'text',
	'c++': 'cpp',
	'c#': 'csharp',
	'f#': 'fsharp',
	'objective-c': 'objc',
	shell: 'bash',
	docker: 'dockerfile',
};

async function highlight(code: string, rawLang: string): Promise<ReactNode> {
	const lang = NOTION_TO_SHIKI_LANG[rawLang.toLowerCase()] ?? rawLang.toLowerCase();
	const opts = {
		themes: { light: 'github-light', dark: 'github-dark' },
		defaultColor: false,
	} as const;
	let hast;
	try {
		hast = await codeToHast(code, { ...opts, lang: lang as BundledLanguage });
	} catch {
		hast = await codeToHast(code, { ...opts, lang: 'text' });
	}
	return toJsxRuntime(hast, { Fragment, jsx, jsxs });
}

async function Code({ block }: { block: INotionBlock }) {
	const text = (block.data.rich_text as RichText[])
		.map(r => r.plain_text)
		.join('');
	const lang = block.data.language || '';
	const highlighted = await highlight(text, lang);
	return (
		<figure className="code-block" style={{ margin: '0 0 1.4em' }}>
			{lang && (
				<figcaption
					className="mono-xs"
					style={{
						padding: '8px 16px',
						borderTopLeftRadius: 4,
						borderTopRightRadius: 4,
						border: '1px solid var(--rule-soft)',
						borderBottom: 0,
						letterSpacing: '0.08em',
						color: 'var(--ink-3)',
					}}
				>
					{lang.toUpperCase()}
				</figcaption>
			)}
			{highlighted}
		</figure>
	);
}

function Quote({ block }: { block: INotionBlock }) {
	return (
		<blockquote
			style={{
				margin: '1.4em 0',
				padding: '6px 0 6px 20px',
				borderLeft: '2px solid var(--accent)',
				fontFamily: 'var(--font-display)',
				fontSize: 22,
				fontStyle: 'italic',
				color: 'var(--ink-2)',
				lineHeight: 1.5,
			}}
		>
			{renderRichText(block.data.rich_text)}
		</blockquote>
	);
}

function Callout({ block }: { block: INotionBlock }) {
	const emoji = block.data.icon?.emoji;
	return (
		<div
			style={{
				margin: '0 0 1.4em',
				padding: '14px 18px',
				background: 'var(--paper-2)',
				border: '1px solid var(--rule-soft)',
				borderRadius: 4,
				display: 'flex',
				gap: 12,
			}}
		>
			{emoji && <span style={{ fontSize: 20, lineHeight: 1.5 }}>{emoji}</span>}
			<div
				style={{ fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.55 }}
			>
				{renderRichText(block.data.rich_text)}
			</div>
		</div>
	);
}

function Divider() {
	return <hr style={{ margin: '2em 0' }} />;
}

function ImageBlock({ block }: { block: INotionBlock }) {
	const src =
		block.data.file?.url ||
		block.data.external?.url ||
		'';
	if (!src) return null;
	const caption = (block.data.caption as RichText[] | undefined)?.map(
		r => r.plain_text
	).join('');
	return (
		<figure style={{ margin: '1.4em 0' }}>
			{/* Using a plain img tag avoids having to allowlist every random Notion
			    file host in next.config.mjs. next/image would be nicer if Notion
			    URLs were stable, but they rotate signatures hourly. */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={src}
				alt={caption || ''}
				style={{
					width: '100%',
					height: 'auto',
					display: 'block',
					border: '1px solid var(--rule-soft)',
				}}
			/>
			{caption && (
				<figcaption
					className="mono-xs"
					style={{ marginTop: 8, textAlign: 'center' }}
				>
					{caption}
				</figcaption>
			)}
		</figure>
	);
}

function ToDo({ block }: { block: INotionBlock }) {
	const checked = !!block.data.checked;
	return (
		<div
			style={{
				display: 'flex',
				gap: 10,
				margin: '0 0 0.6em',
				alignItems: 'baseline',
				color: 'var(--ink-2)',
			}}
		>
			<span
				style={{
					width: 14,
					height: 14,
					border: '1px solid var(--rule)',
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: 10,
					flexShrink: 0,
				}}
			>
				{checked ? '✓' : ''}
			</span>
			<span
				style={{
					textDecorationLine: checked ? 'line-through' : 'none',
					opacity: checked ? 0.6 : 1,
				}}
			>
				{renderRichText(block.data.rich_text)}
			</span>
		</div>
	);
}

/**
 * Groups consecutive list items into a single <ul>/<ol> so the runs render
 * as real lists instead of one `<li>` per block.
 */
function groupBlocks(blocks: INotionBlock[]): Array<
	| { type: 'block'; block: INotionBlock }
	| { type: 'bulleted'; items: INotionBlock[] }
	| { type: 'numbered'; items: INotionBlock[] }
> {
	const out: ReturnType<typeof groupBlocks> = [];
	for (const b of blocks) {
		if (b.type === 'bulleted_list_item') {
			const last = out[out.length - 1];
			if (last && last.type === 'bulleted') last.items.push(b);
			else out.push({ type: 'bulleted', items: [b] });
		} else if (b.type === 'numbered_list_item') {
			const last = out[out.length - 1];
			if (last && last.type === 'numbered') last.items.push(b);
			else out.push({ type: 'numbered', items: [b] });
		} else {
			out.push({ type: 'block', block: b });
		}
	}
	return out;
}

export function Blocks({ blocks }: { blocks: INotionBlock[] }) {
	const groups = groupBlocks(blocks);
	return (
		<>
			{groups.map((g, i) => {
				if (g.type === 'bulleted') return <BulletedList key={i} items={g.items} />;
				if (g.type === 'numbered') return <NumberedList key={i} items={g.items} />;
				return <Block key={g.block.id} block={g.block} />;
			})}
		</>
	);
}

function Block({ block }: { block: INotionBlock }) {
	switch (block.type) {
		case 'paragraph':
			return <Paragraph block={block} />;
		case 'heading_1':
			return <Heading block={block} level={1} />;
		case 'heading_2':
			return <Heading block={block} level={2} />;
		case 'heading_3':
			return <Heading block={block} level={3} />;
		case 'code':
			return <Code block={block} />;
		case 'quote':
			return <Quote block={block} />;
		case 'callout':
			return <Callout block={block} />;
		case 'divider':
			return <Divider />;
		case 'image':
			return <ImageBlock block={block} />;
		case 'to_do':
			return <ToDo block={block} />;
		case 'bookmark':
		case 'embed': {
			const href = block.data.url;
			return href ? (
				<p
					style={{
						margin: '1em 0',
						padding: '12px 16px',
						border: '1px solid var(--rule)',
						borderRadius: 4,
					}}
				>
					<a
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						style={{
							color: 'var(--ink)',
							textDecorationLine: 'underline',
							textDecorationColor: 'var(--accent)',
						}}
					>
						{href}
					</a>
				</p>
			) : null;
		}
		default:
			// Unknown block type — silently skip rather than blow up.
			return null;
	}
}
