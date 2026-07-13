import { z, defineCollection } from "astro:content";
import { Image } from 'astro:assets';

// Every collection must reflect Decap's config.yml collection schema
// In order to be able to optimize images with Astro built-in compoments, like <Image />, we first must use this image helper 
// Doc: https://docs.astro.build/en/guides/images/#images-in-content-collections

const blogsCollection = defineCollection({
	type: "content",
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			author: z.string(),
			date: z.date(),
			// Set when a post is materially revised. AI search engines weight
			// recency heavily, so a reviewed post should say so. Falls back to
			// `date` when absent.
			updated: z.date().optional(),
            tags: z.array(z.string()),
			image: image(),
			imageAlt: z.string(),
		}),
});

const servicesCollection = defineCollection({
	type: "content",
	schema: ({ image }) =>
		z.object({
		FormalName: z.string(),
		Name: z.string(),
		Title1: z.string(),
		Description1: z.string(),
		Title2: z.string(),
		Description2: z.string(),
		// Replace ImagePath with image object
		Image: image(), // Main service image
		Image2: image(), // Secondary service image
		ShortDescription: z.string(),
		IconName: z.string()
		})
  });
  
  const industriesCollection = defineCollection({
	type: "content",
	schema: ({ image }) =>
		z.object({

			FormalName: z.string(),
			Name: z.string(),
			Description: z.string(),
			Image: image() // Replace ImagePath with image object
		})
});


export const collections = {
	blog: blogsCollection,
	industries: industriesCollection,
	services: servicesCollection
};