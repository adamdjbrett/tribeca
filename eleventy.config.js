import fs from "node:fs";
import path from "node:path";
import Handlebars from "handlebars";
import { DateTime } from "luxon";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

function registerPartialsRecursive(dir, baseDir = dir) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      registerPartialsRecursive(fullPath, baseDir);
      continue;
    }
    if (!entry.isFile() || path.extname(entry.name) !== ".hbs") continue;

    const relativeName = path
      .relative(baseDir, fullPath)
      .replace(/\\/g, "/")
      .replace(/\.hbs$/i, "");

    Handlebars.registerPartial(relativeName, fs.readFileSync(fullPath, "utf8"));
  }
}

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readingTimeText(value) {
  const wordCount = stripHtml(value).split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} min read`;
}

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  registerPartialsRecursive(path.join(process.cwd(), "_includes_11ty", "partials"));

  eleventyConfig.addExtension("hbs", {
    key: "hbs",
    outputFileExtension: "html",
    compile: async (inputContent) => {
      const template = Handlebars.compile(inputContent);
      return (data) => template(data);
    }
  });

  eleventyConfig.addPassthroughCopy({ assets: "assets" });

  const readableDate = (value, format = "d MMM yyyy") => {
    const date = toDate(value);
    if (!date) return "";
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat(format);
  };

  const htmlDateString = (value) => {
    const date = toDate(value);
    if (!date) return "";
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat("yyyy-LL-dd");
  };

  const year = (value) => {
    const date = toDate(value);
    if (!date) return "";
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat("yyyy");
  };

  const excerpt = (value, limit = 140) => {
    const text = stripHtml(value);
    if (text.length <= limit) return text;
    return `${text.slice(0, limit).trim()}...`;
  };

  const postsWithTag = (posts, tag) =>
    Array.isArray(posts)
      ? posts.filter((item) => Array.isArray(item?.data?.tags) && item.data.tags.includes(tag))
      : [];

  const postsWithAuthor = (posts, author) =>
    Array.isArray(posts)
      ? posts.filter((item) => Array.isArray(item?.data?.authors) && item.data.authors.includes(author))
      : [];

  Handlebars.registerHelper("readableDate", readableDate);
  Handlebars.registerHelper("htmlDateString", htmlDateString);
  Handlebars.registerHelper("year", year);
  Handlebars.registerHelper("excerpt", excerpt);
  Handlebars.registerHelper("slugify", slugify);
  Handlebars.registerHelper("readingTime", readingTimeText);
  Handlebars.registerHelper("postsWithTag", postsWithTag);
  Handlebars.registerHelper("postsWithAuthor", postsWithAuthor);

  eleventyConfig.addFilter("readableDate", readableDate);
  eleventyConfig.addFilter("htmlDateString", htmlDateString);
  eleventyConfig.addFilter("year", year);
  eleventyConfig.addFilter("excerpt", excerpt);
  eleventyConfig.addFilter("slugify", slugify);
  eleventyConfig.addFilter("postsWithTag", postsWithTag);
  eleventyConfig.addFilter("postsWithAuthor", postsWithAuthor);

  const getPostItems = (collectionApi) =>
    collectionApi
      .getFilteredByGlob("content/posts/*.{md,hbs,html}")
      .filter((item) => item.data.draft !== true)
      .sort((a, b) => b.date - a.date);

  eleventyConfig.addCollection("posts", (collectionApi) => getPostItems(collectionApi));

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagSet = new Set();
    for (const item of getPostItems(collectionApi)) {
      for (const tag of item.data.tags || []) {
        if (["posts", "all", "nav"].includes(tag)) continue;
        tagSet.add(tag);
      }
    }
    return [...tagSet].sort((a, b) => a.localeCompare(b));
  });

  eleventyConfig.addCollection("authorList", (collectionApi) => {
    const authorSet = new Set();
    for (const item of getPostItems(collectionApi)) {
      for (const author of item.data.authors || []) {
        authorSet.add(author);
      }
    }
    return [...authorSet].sort((a, b) => a.localeCompare(b));
  });

  return {
    dir: {
      input: "content",
      includes: "../_includes_11ty",
      data: "../_data_11ty",
      output: "_site"
    },
    markdownTemplateEngine: false,
    htmlTemplateEngine: false,
    dataTemplateEngine: "hbs",
    templateFormats: ["md", "hbs", "njk", "html"]
  };
}
