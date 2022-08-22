/**
 * Send Invoice Email
 * @author Shuja Naqvi
 */
var nodemailer = require('nodemailer');

const sender_name = process.env.MAILER_DOMAIN;
const sender_email = process.env.MAILER_EMAIL;
const sender_password = process.env.MAILER_PASSWORD;
const Request = require('../models/Requests');
/**
 * sendEmail
 * @param {string} subject
 * @param {object} data
 * @return {void}
 */

exports.sendRequestEmail = (request) => {
  return new Promise((resolve, reject) => {
    //  // Sender mail server config
    //  const filePath = path.join(
    //    __dirname,
    //    "../template/invoiceEmailTemplate.html"
    //  );
    //  const source = fs.readFileSync(filePath, "utf-8").toString();
    //  const template = handlebars.compile(source);
    //  const data = {
    //    name: user.first_name + " " + user.last_name,
    //  };
    //  const htmlToSend = template(data);

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: 'shujanaqvi@falconit.com.pk',
      subject: 'Certfication  Request',
      html: RequestTemplate(request),
      //    attachments: [
      //      {
      //        filename: "InvoiceReport.pdf",
      //        path: `${attachment}`, // stream this file
      //      },
      //    ],
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

const RequestTemplate = (reuqest) => {
  return `
  <body style="margin: 0; padding: 0">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background: #ffffff">
      <tr>
        <td align="center" style="padding: 0">
          <table
            role="presentation"
            style="width: 650px; border-collapse: collapse; border: 1px solid #cccccc; border-spacing: 0; text-align: left"
          >
            <tr>
              <td align="center" style="padding: 20px 5px 10px 5px; background: rgba(206, 197, 237, 0.1)">
                <span
                  style="
                  color: #7F56D9;
                  font-size: 42px;
                  font-family: fantasy;
                  letter-spacing: 0;
                  line-height: 42px;
                  text-align: left;
                "
                >
                  Ezxport.
                </span>
                <h2 style="font-family: Verdana; color: #7F56D9>Certification Request</h2>
                <h4 style="font-family: Verdana; color: #7F56D9">Details of request are below:</h4>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 10px 10px 10px 10px; background: rgba(206, 197, 237,0.3)">
              <table>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">User</th>
                  <th scope="col">Vender</th>
                  <th scope="col">Seller</th>
                  <th scope="col">Buyer</th>
                </tr>
              </thead>
              <tbody>
        <tr>
          <th>Email</th>
          
          <td>${reuqest.user.email}  </td>
          ${reuqest.vendor.contact_email ? `<td>${reuqest.vendor.contact_email}</td>` : `<td>--------------</td>`}      
          <td>${reuqest.seller.email}  </td>
          <td>${reuqest.buyer.email}  </td>
        </tr>
        <tr>
          <th>Phone Number</th>
          <td>${reuqest.user.phone_number}  </td>
          <td>${reuqest.user.phone_number}  </td>
          <td>${reuqest.seller.phone_number}  </td>
          <td>${reuqest.buyer.phone_number}  </td>
        </tr>
        <tr>
          <th>Address</th>
          <td>${reuqest.user.address}  </td>
          <td>${reuqest.user.address}  </td>
          <td>${reuqest.seller.address}  </td>
          <td>${reuqest.buyer.address}  </td>
        </tr>
        <tr>
          <th>City</th>
          <td>${reuqest.user.city}  </td>
          <td>${reuqest.user.city}  </td>
          <td>${reuqest.seller.city}  </td>
          <td>${reuqest.buyer.city}  </td>
        </tr>
        
        <tr>
          <th>Company</th>
          <td>${reuqest.user.company.name}  </td>
          <td>${reuqest.user.company.name}  </td>
          <td>${reuqest.seller.company_name}  </td>
          <td>${reuqest.buyer.company_name}  </td>
        </tr>
        </tbody>
              </table>
              </td>
            </tr>


            <tr>
              <td align="center" style="padding: 10px 10px 10px 10px; background: rgba(206, 197, 237,0.3)">
              <table>
              <thead>
                <tr>
                  <th scope="col">User</th>
                  <th scope="col">Vender</th>
                  <th scope="col">Seller</th>
                  <th scope="col">Buyer</th>
                </tr>
              </thead>
              <tbody>
        <tr>
          <th>Email</th>
          
          <td>${reuqest.user.email}  </td>
          ${reuqest.vendor.contact_email ? `<td>${reuqest.vendor.contact_email}</td>` : `<td>--------------</td>`}      
          <td>${reuqest.seller.email}  </td>
          <td>${reuqest.buyer.email}  </td>
        </tr>
        <tr>
          <th>Phone Number</th>
          <td>${reuqest.user.phone_number}  </td>
          <td>${reuqest.user.phone_number}  </td>
          <td>${reuqest.seller.phone_number}  </td>
          <td>${reuqest.buyer.phone_number}  </td>
        </tr>
        <tr>
          <th>Address</th>
          <td>${reuqest.user.address}  </td>
          <td>${reuqest.user.address}  </td>
          <td>${reuqest.seller.address}  </td>
          <td>${reuqest.buyer.address}  </td>
        </tr>
        <tr>
          <th>City</th>
          <td>${reuqest.user.city}  </td>
          <td>${reuqest.user.city}  </td>
          <td>${reuqest.seller.city}  </td>
          <td>${reuqest.buyer.city}  </td>
        </tr>
        
        <tr>
          <th>Company</th>
          <td>${reuqest.user.company.name}  </td>
          <td>${reuqest.user.company.name}  </td>
          <td>${reuqest.seller.company_name}  </td>
          <td>${reuqest.buyer.company_name}  </td>
        </tr>
        </tbody>
              </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 10px 10px 10px 10px; background: rgba(206, 197, 237,0.3)">
              <table>
              <thead>
                <tr>
                
                  <th scope="col">Company Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Address</th>
                  <th scope="col">City</th>
                  <th scope="col">Zip Code</th>
                </tr>
              </thead>
              <tbody>
        <tr>
          <td>${reuqest.place.company_name}  </td>  
          <td>${reuqest.place.email}  </td>
          <td>${reuqest.place.phone_number}  </td>
          <td>${reuqest.place.address}  </td>
          <td>${reuqest.place.city}  </td>
          <td>${reuqest.place.zipcode}  </td>
        </tr>
        </tbody>
              </table>
              </td>
            </tr>
            <tr>
              <td>
                <p align="center" style="color: #000; font-family: Verdana">
                  Kindly check all data.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  `;
};
