import * as cheerio from "cheerio";
import * as pagefind from "pagefind";

import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { inspect } from 'node:util';

const output = "_dist";
const statics = "{svg,webp,png,jpg,jpeg,gif}";

export default async function(eleventyConfig) {
  eleventyConfig.setOutputDirectory(output);

	eleventyConfig.addPassthroughCopy("favicon.ico");
	eleventyConfig.addPassthroughCopy("content/");

	eleventyConfig.addPassthroughCopy(`posts/**/*.${statics}`, {mode: "html-relative"});

  eleventyConfig.addFilter("inspect", (obj) => {
    return inspect(obj, {sorted: true});
  });

  eleventyConfig.addCollection("featuredPosts", function(collectionsAPI) {
    return collectionsAPI.getAllSorted().filter((item) => {
      return item.data.featured === true;
    });
  });

	eleventyConfig.addTransform("pagefind-image-tagging", function (content) {
		let p = this.page.outputPath || "";

		if (p.endsWith(".html") && (p.includes("/posts/"))) {
			let doc = cheerio.load(content);
			let el = doc("#content p > img");

			if (el.length < 1) {
				doc("#content").prepend(
					"<span data-pagefind-meta='image[src]' src='/content/images/blank.jpg'></span>"
				);
			} else {
				let absoluteP = "/" + (el.attr("src") || "").replace(".", p.split("/").slice(2, -1).join("/"));

				el.attr("src", absoluteP);
				el.attr("data-pagefind-meta", "image[src]");
			};

			return doc.html();
		};

		return content;
	});

	eleventyConfig.addPlugin(feedPlugin, {
		type: "rss",
		outputPath: "/feed.xml",
		collection: {
			name: "post",
			limit: 15,
		},
		metadata: {
			language: "en",
			title: "yareli's press",
			subtitle: "occasional essays and letters on video games, manga, personal, et al.",
			base: "https://yareli.nekoweb.org",
			author: {
				name: "yareli"
			}
		}
	});

  eleventyConfig.on('eleventy.after', async () => {
		const { index } = await pagefind.createIndex();

		await index.addDirectory({path: `${output}/posts`});
		await index.writeFiles({outputPath: `${output}/content/pagefind`});

		await pagefind.close();
  });
};