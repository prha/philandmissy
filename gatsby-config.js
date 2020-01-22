module.exports = {
  pathPrefix: "/missyandphil",
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-transformer-json",
    {
      resolve: "gatsby-plugin-create-client-paths",
      options: { prefixes: ["/*"] }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "data",
        path: `${__dirname}/src/data/`
      }
    }
  ]
};
