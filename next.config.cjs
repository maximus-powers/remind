require('dotenv').config();

module.exports = {
  staticPageGenerationTimeout: 300,
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};