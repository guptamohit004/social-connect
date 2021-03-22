// Config file to be needed, so as to use the module 'next-pwa', so as to enable PWA for the application.
const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    dest: 'public'
  }
});