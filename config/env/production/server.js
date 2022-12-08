// Path: ./config/env/production/server.js`

module.exports = ({ env }) => ({
  url: env("RENDER_EXTERNAL_URL"),
});
