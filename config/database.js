// strapi-api/config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "ec2-44-199-22-207.compute-1.amazonaws.com"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "d63c15emqhff21"),
      user: env("DATABASE_USERNAME", "jwhjyyvyyzpvpm"),
      password: env(
        "DATABASE_PASSWORD",
        "f0c64a4c7ca5d112343e1faad3b35f809b5eaf72d96937248c900357f34e38c3"
      ),
      schema: env("DATABASE_SCHEMA", "public"), // Not required
      ssl: {
        rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false),
      },
    },
    debug: false,
  },
});
