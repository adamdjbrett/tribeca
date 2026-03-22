export default {
  layout: "layouts/post.hbs",
  tags: ["posts"],
  bodyClass: "post-template",
  permalink: (data) => `/posts/${data.page.fileSlug}/index.html`,
  eleventyComputed: {
    nextPost: (data) => {
      const posts = data.collections?.posts || [];
      const currentIndex = posts.findIndex((post) => post.url === data.page.url);
      if (currentIndex < 0) return null;
      return currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
    },
    prevPost: (data) => {
      const posts = data.collections?.posts || [];
      const currentIndex = posts.findIndex((post) => post.url === data.page.url);
      if (currentIndex < 0) return null;
      return currentIndex > 0 ? posts[currentIndex - 1] : null;
    }
  }
};
