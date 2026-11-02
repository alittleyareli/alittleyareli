import path from 'node:path';
import crypto from 'node:crypto';

import * as cheerio from "cheerio";
import * as pagefind from "pagefind";

import { dateToRfc3339, dateToRfc822 } from "@11ty/eleventy-plugin-rss";
import { HtmlBasePlugin, RenderPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const output = "_dist";

export default function(eleventyConfig) {
  eleventyConfig.setOutputDirectory(output);

  eleventyConfig.setLayoutsDirectory("_includes/");

	eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("content/");

  eleventyConfig.addPassthroughCopy("posts/**/*.jpeg");

	eleventyConfig.addFilter("dateToRfc3339", dateToRfc3339);
	eleventyConfig.addFilter("dateToRfc822", dateToRfc822);

	eleventyConfig.addFilter("now", (obj) => {
		return Date();
	});

	eleventyConfig.addFilter("default", (obj, value) => {
		return obj ? obj : value;
	});

	eleventyConfig.addFilter("contentAsXHTML", (obj) => {
		return obj.replace(/(<img\b[^<>]*[^<>\/])>/ig, "$1 />");
	});

  eleventyConfig.addCollection("featuredPosts", function(collectionsAPI) {
    return collectionsAPI.getAllSorted().filter((item) => {
			if (item.data.meta) {
      	return item.data.meta.featured === true;
			};
    });
  });

	eleventyConfig.addTransform("pagefind-image-tagging", function (content) {
		let p = this.page.outputPath || "";

		if (p.endsWith(".html") && (p.includes("/posts/"))) {
			let doc = cheerio.load(content);
			let el = doc("#content p > img");

			if (el.length < 1) {
				doc("#content").prepend("<span data-pagefind-meta='image[src]' src='/content/images/blank.jpeg'></span>");
			} else {
				el.attr("data-pagefind-meta", "image[src]");
			};

			return doc.html();
		};

		return content;
	});

	eleventyConfig.addPlugin(RenderPlugin);
	eleventyConfig.addPlugin(HtmlBasePlugin);

	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		formats: ["auto"],
		widths: ["auto"],
		urlPath: "/content/images/",
		useCache: false,
		htmlOptions: {
			imgAttributes: {
        alt: "",
				loading: "lazy",
				decoding: "async",
			}
		},
	});

  eleventyConfig.on('eleventy.after', async () => {
		const { index } = await pagefind.createIndex();

		await index.addDirectory({path: `${output}/posts`});
		await index.writeFiles({outputPath: `${output}/content/pagefind`});

		await pagefind.close();
  });
};