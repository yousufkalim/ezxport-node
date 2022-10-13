/**
 * Send Invoice Email
 * @author Shuja Naqvi
 */
var nodemailer = require('nodemailer');

const sender_name = process.env.MAILER_DOMAIN;
const sender_email = process.env.MAILER_EMAIL;
const sender_password = process.env.MAILER_PASSWORD;
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const moment = require('moment');

/**
 * sendEmail
 * @param {string} subject
 * @param {object} data
 * @return {void}
 */

exports.sendRequestEmail = request => {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password
      }
    });
    if (!request?.vendor?.vendor?.sending_email) {
      reject({ success: false, message: 'No Recipients Found' });
    }
    //Accessing HTML :)
    const data = {
      user_email: request.user.email,
      vendor_email: request?.vendor?.contact_email ? request?.vendor?.contact_email : '------',
      buyer_email: request.buyer.email,
      seller_email: request.seller.email,
      user_city: request.user.city,
      buyer_city: request.buyer.city,
      seller_city: request.seller.city,
      user_zip: request.user.zipcode,
      buyer_zip: request.buyer.zipcode,
      seller_zip: request.seller.zipcode,
      user_address: request.user.address,
      buyer_address: request.buyer.address,
      seller_address: request.seller.address,
      user_phone_number: request.user.phone_number,
      seller_phone_number: request.seller.phone_number,
      buyer_phone_number: request.buyer.phone_number,
      user_company_name: request.user.company.name,
      seller_company_name: request.seller.company_name,
      buyer_company_name: request.buyer.company_name,
      inspection_date: moment(request.inspection_date).format('DD-MM-YYYY'),
      place_fname:
        request.place.contact_fname !== '' ? request.place.contact_fname : 'Not Provided',
      place_lname:
        request.place.contact_lname !== '' ? request.place.contact_lname : 'Not Provided',
      place_company_name: request.place.company_name,
      place_email: request.place.email,
      place_phone_number: request.place.phone_number,
      place_address: request.place.address,
      place_city: request.place.city,
      place_zipcode: request.place.zipcode,
      documents: request.documents,
      codes: request.codes
    };
    const filePath = path.join(__dirname, './RequestEmailTemp.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const htmlToSend = template(data);
    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: request.vendor.vendor.sending_email,
      subject: 'Certfication  Request',
      html: htmlToSend
    };
    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};
