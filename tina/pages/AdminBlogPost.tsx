import React from 'react';
import { tinaField, useTina } from "tinacms/dist/react";
import type { BlogQuery, BlogQueryVariables } from '../__generated__/types';
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import FormattedDate from '../../src/components/react/FormattedDate.tsx';
import ReactMarkdown from 'react-markdown';


type Props = {
	variables: BlogQueryVariables;
	data: BlogQuery;
	query: string;
}

export default function AdminBlogPost(props: Props) {

	const { data } = useTina({
		query: props.query,
		variables: props.variables,
		data: props.data,
	})

	const blog = data.blog;

	// Helper to fix image paths with base URL
	const getImageSrc = (heroImage: string) => {
		// If image starts with /, prepend base URL
		if (heroImage?.startsWith('/')) {
			const baseUrl = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
			return baseUrl + heroImage;
		}
		return heroImage; // Return as-is for external URLs or relative paths
	};

	return (
		<article>
			<div data-tina-field={tinaField(blog, "heroImage")} className="hero-image">
				{blog.heroImage && <img width={1020} height={510} src={getImageSrc(blog.heroImage)} alt="" />}
			</div>
			<div className="prose">
				<div className="title">
					<div className="date" data-tina-field={tinaField(blog, "pubDate")} >
						<FormattedDate date={blog.pubDate} />
						{
							blog.updatedDate && (
								<div className="last-updated-on" data-tina-field={tinaField(blog, "updatedDate")} >
									Last updated on <FormattedDate date={blog.updatedDate} />
								</div>
							)
						}
					</div>
					<h1 data-tina-field={tinaField(blog, "title")} >{blog.title}</h1>
					<hr />
				</div>
				<div data-tina-field={tinaField(blog, "body")}>
					{typeof blog.body === 'string' ? (
						<ReactMarkdown>{blog.body}</ReactMarkdown>
					) : (
						<TinaMarkdown content={blog.body} />
					)}
				</div>
			</div>
		</article>
	);
}
