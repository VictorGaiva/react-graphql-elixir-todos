module.exports = {
  projects: {
    app: {
      schema: "http://localhost:4000/api",
      documents: ["**/*.{graphql,js,ts,jsx,tsx}"],
      endpoints: {
        default: {
          url: "http://localhost:4000/api",
        },
      },
    },
  },
}