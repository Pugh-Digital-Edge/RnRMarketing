import { z, defineCollection } from "astro:content";

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
            tags: z.array(z.string()),
			image: image(),
			imageAlt: z.string(),
		}),
});

const servicesCollection = defineCollection({
	type: 'data',
	schema: z.object({
	  FormalName: z.string(),
	  Name: z.string(),
	  Title1: z.string(),
	  Description1: z.string(),
	  Title2: z.string(),
	  Description2: z.string(),
	  ImagePath: z.string(),
	  ImagePath2: z.string(),
	  ShortDescription: z.string(),
	  IconName: z.string()
	})
});

  const industriesCollection = defineCollection({
	type: 'data',
	schema: z.object({
	  FormalName: z.string(),
	  Name: z.string(),
	  Description: z.string(),
	  ImagePath: z.string()
	})
});


export const collections = {
	blog: blogsCollection,
	industries: industriesCollection,
	services: servicesCollection
};