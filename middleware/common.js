/**
 * Common middleware that we have to use by default every time
 * @author Yousuf Kalim
 */
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

// Common Middleware
module.exports = (app) => {
  app.use(cors({ origin: true })); // CORS (Cross Origin Policy) to restrict unknown requests
  app.use(logger('dev')); // Morgan - to log every request in console
  app.use(express.urlencoded({ extended: true })); // to get url encoded data from requests

  app.use(
    express.json({
      verify: function (req, res, buf) {
        var url = req.originalUrl;
        if (url.startsWith('/api/payments/stripe/webhook')) {
          req.rawBody = buf.toString();
        }
      },
      limit: '50mb',
    })
  ); // to send json data in response (It's mandatory in rest api's)
  app.use('/uploads', express.static('uploads', { maxAge: '31536000' })); // Static path to serve uploaded images with cache policy
};
