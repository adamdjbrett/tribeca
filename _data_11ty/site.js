const isProduction = process.env.ELEVENTY_ENV === "production";
const productionUrl = process.env.SITE_URL || "https://example.com";

export default {
  title: "Tribeca",
  description: "Thoughts, stories and ideas.",
  language: "en",
  locale: "en",
  author: "TryGhost",
  url: isProduction ? productionUrl : "http://localhost:8080",
  logo: "",
  cover_image: "",
  facebook: "",
  twitter: "",
  navigation: [
    { label: "Home", url: "/" },
    { label: "About", url: "/about/" },
    { label: "Contact", url: "/contact/" },
    { label: "Tags", url: "/tags/" },
    { label: "Authors", url: "/authors/" }
  ]
};
