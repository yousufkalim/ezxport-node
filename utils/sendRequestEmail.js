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
      to: 'shujanaqvi288@gmail.com',
      subject: 'Certfication  Request',
      html: RequestTemplate(request),
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

const RequestTemplate = (request) => {
  return `

<body style="margin: 0; padding: 0">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background: #ffffff">
        <tr>
            <td align="center" style="padding: 0">
                <table role="presentation" style="width: 800px; border-collapse: collapse; border: 1px solid #cccccc; border-spacing: 0; text-align: left">
                    <tr>
                        <td align="center" style="padding: 20px 5px 10px 5px; background: rgba(206, 197, 237, 0.1)">
                            <span style="
      color: #7F56D9;
      font-size: 42px;
      font-family: fantasy;
      letter-spacing: 0;
      line-height: 42px;
      text-align: left;
    ">
      Ezxport.
    </span>
    <h2 style="font-family: Verdana; color: #7F56D9>Certification Request</h2>
    <h4 style=" font-family: Verdana; color: #7F56D9 ">Details of request are below:</h4>
  </td>
</tr>
<tr>
  <td 
  align="center "
  style="background: rgba(206, 197, 237,0.3) ">
  <table 
  style=" width: 100%; text-align: center; border-collapse: collapse; ">
  <thead>
    <tr
     style=" border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
      <th style="text-align:center; border-right: 1px solid black; " scope="col ">#</th>
      <th style="text-align:center; border-right: 1px solid black; " scope="col ">User</th>
      <th style="text-align:center; border-right: 1px solid black; " scope="col ">Vender</th>
      <th style="text-align:center; border-right: 1px solid black; " scope="col ">Seller</th>
      <th style="text-align:center; border-right: none; "            scope="col ">Buyer</th>
    </tr>
  </thead>
  <tbody>
  <tr 
   style=" border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
<th 
style=" text-align:center; border-right: 1px solid black; ">Email</th>

<td 
style="text-align:center; border-right: 1px solid black; ">${request.user.email}</td>
${
  request.vendor.contact_email
    ? `<td 
  style=
  "text-align:center; border-right: 1px solid black; ">${request.vendor.contact_email}</td>`
    : `<td style="text-align:center; border-right: 1px solid black; ">---------</td>`
}      
<td style="text-align:center; border-right: 1px solid black; ">${request.seller.email}  </td>
<td style="text-align:center; border-right: none; ">${request.buyer.email}  </td>
</tr
<tr style=" border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
<th style="text-align:center; border-right: 1px solid black; ">Phone Number</th>
<td style="text-align:center; border-right: 1px solid black; ">${request.user.phone_number}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${request.user.phone_number}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${request.seller.phone_number}  </td>
<td style="text-align:center; border-right: none; ">${request.buyer.phone_number}  </td>
</tr>
<tr style=" border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
<th style="text-align:center; border-right: 1px solid black; ">Address</th>
<td style="text-align:center; border-right: 1px solid black; ">${request.user.address}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${request.user.address}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${request.seller.address}  </td>
<td style="text-align:center; border-right: none; ">${request.buyer.address}  </td>
</tr>
<tr style=" border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
<th style="text-align:center; border-right: 1px solid black; ">City</th>
<td style="text-align:center; border-right: 1px solid black; ">${request.user.city}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${request.user.city}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${request.seller.city}  </td>
<td style="text-align:center; border-right: none; ">${request.buyer.city}  </td>
</tr>
<tr style=" border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
<th style="text-align:center; border-right: 1px solid black; ">Company</th>
<td style="text-align:center; border-right: 1px solid black; ">${request.user.company.name}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${request.user.company.name}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${request.seller.company_name}  </td>
<td style="text-align:center; border-right: none; ">${request.buyer.company_name}  </td>
</tr>
</tbody>
  </table>
  </td>
</tr>
<tr>
  <td align="center " 
  style=" background: rgba(206, 197, 237, 0.1) ">
    <p align="center " 
    style=" color: #7F56D9; font-size: 24px; font-family: fantasy; margin:10px 0px 0px 0px; ">
     Place of Inspection
    </p>
    <p align="center " 
    style=
    "color: #000; font-family: Verdana ">
   <span 
   style=" color: #7F56D9; font-size: 18px; font-family: fantasy; "
   > Inspection Date:</span> 
     ${new Date(request.inspection_date)}
    </p>
  <table  
  style="width: 100%; text-align: center; border-collapse: collapse; background: rgba(206, 197, 237, 0.3) ">
  <thead>
    <tr style=
    "border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
      <th style="text-align:center;border-right: 1px solid black; border-right: 1px solid black; " scope="col ">Company Name</th>
      <th style="text-align:center;border-right: 1px solid black; border-right: 1px solid black; " scope="col ">Email</th>
      <th style="text-align:center;border-right: 1px solid black; border-right: 1px solid black; " scope="col ">Phone</th>
      <th style="text-align:center;border-right: 1px solid black; border-right: 1px solid black; " scope="col ">Address</th>
      <th style="text-align:center;border-right: 1px solid black; border-right: 1px solid black; " scope="col ">City</th>
      <th style="text-align:center;border-right: 1px solid black; border-right:none; " scope="col ">Zip Code</th>
    </tr>
  </thead>
  <tbody>
<tr
border-top: 1px solid #78858e;
border-bottom: 1px solid #78858e;>
<td style="text-align:center; border-right: 1px solid black; ">${request.place.company_name}  </td>  
<td style="text-align:center; border-right: 1px solid black; ">${request.place.email}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${request.place.phone_number}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${request.place.address}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${request.place.city}  </td>
<td style="text-align:center; border-right: none; ">${request.place.zipcode}  </td>
</tr> 
</tbody>
  </table>
  </td>
</tr>
<tr>
  <td align="center " 
  style="padding: 10px 0px 10px 0px; background: rgba(206, 197, 237, 0.1) ">
    <p align="center " 
    style=" color: #7F56D9; font-size: 20px; font-family: fantasy; ">
     Products Detail
    </p>
    ${request.codes
      .map(
        (e) =>
          `
          <p align="center " style="margin:0 ">
        <span style= "color: #7F56D9; font-family: fantasy; ">Code:</span> ${e.code.code}
        </p>
        <p align="center " style="margin:0 ">
        <span style="color: #7F56D9; font-family: fantasy; ">Certificartion Required:</span>${e.code.certification_required}
        </p>
        <p align="center " style="margin:0 ">
        <span style="color: #7F56D9; font-family: fantasy; ">Monetory Value:</span>${e.monetary_value}
        </p>
        
  ${e.products
    .map(
      (p) =>
        `
    <tr>
        <td align="center ">
  <table  
  style="width: 100%; text-align: center; border-collapse: collapse; background: rgba(206, 197, 237, 0.3) ">
  <thead>
    <tr style=
    "border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
      <th style="text-align:center;border-right: 1px solid black; border-right: 1px solid black; " scope="col ">Name</th>
      <th style="text-align:center;border-right: 1px solid black; border-right: 1px solid black; " scope="col ">Amount</th>
      <th style="text-align:center;border-right: 1px solid black; border-right: 1px solid black; " scope="col ">condition</th>
      <th style="text-align:center;border-right: 1px solid black; border-right: 1px solid black; " scope="col ">Price</th>
      <th style="text-align:center;border-right: 1px solid black; border-right: 1px solid black; " scope="col ">Mark</th>
      <th style="text-align:center;border-right: 1px solid black; border-right:none; " scope="col ">Builder</th>
    </tr>
  </thead>
    <tbody>
       <tr>
<td style="text-align:center; border-right: 1px solid black; ">${p.name}  </td>  
<td style="text-align:center; border-right: 1px solid black; ">${p.amount}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${p.condition}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${p.price.value}${p.price.currency}  </td>
<td style="text-align:center; border-right: 1px solid black; ">${p.mark}  </td>
<td style="text-align:center; border-right: none; ">${p.builder}  </td>
</tr>
</tbody>
</table>
</td>
</tr>
${
  p.technical_sheet &&
  `
  <tr>
        <td align="center ">
  <table  
  style="width: 100%; text-align: center; border-collapse: collapse; ">
  <thead>
    <tr style=
    "border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
      <th style="text-align:center;color: #7F56D9;  font-family: fantasy; font-size:16px;  background: rgba(206, 197, 237, 0.1) " scope="col ">Technical Sheets</th>
    </tr>
  </thead>
  <tbody>
  ${p.technical_sheet.url
    .map(
      (e) =>
        `
        <tr>
<td style="text-align:center; background: rgba(206, 197, 237, 0.3)"> ${process.env.SERVER_URL}${e} </td>  
</tr>
    `
    )
    .join('')} `
}

${
  p.analysis_certificate &&
  `
  <tr>
        <td align="center ">
  <table  
  style="width: 100%; text-align: center; border-collapse: collapse; ">
  <thead>
    <tr style=
    "border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
      <th style="text-align:center; color: #7F56D9;  font-family: fantasy; font-size:16px;  background: rgba(206, 197, 237, 0.1)" scope="col ">Analysis Certificates</th>
    </tr>
  </thead>
  <tbody>
  ${p.analysis_certificate.url
    .map(
      (e) =>
        `
        <tr>
<td style="text-align:center;  background: rgba(206, 197, 237, 0.2) "> ${process.env.SERVER_URL}${e} </td>  
</tr>
    `
    )
    .join('')} `
}

${
  p.plan &&
  `
  <tr>
        <td align="center ">
  <table  
  style="width: 100%; text-align: center; border-collapse: collapse;  ">
  <thead>
    <tr style=
    "border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
      <th style="text-align:center; color: #7F56D9;  font-family: fantasy;  font-size:16px;  background: rgba(206, 197, 237, 0.1)" scope="col ">Plans</th>
    </tr>
  </thead>
  <tbody>
  ${p.plan.url
    .map(
      (e) =>
        `
        <tr>
<td style="text-align:center; background: rgba(206, 197, 237, 0.3)"> ${process.env.SERVER_URL}${e} </td>  
</tr>
    `
    )
    .join('')} `
}
${
  p.other_docs &&
  `
  <tr>
        <td align="center ">
  <table  
  style="width: 100%; text-align: center; border-collapse: collapse;  ">
  <thead>
    <tr style=
    "border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
      <th style="text-align:center;  color: #7F56D9;  font-family: fantasy;  font-size:16px;  background: rgba(206, 197, 237, 0.1)" scope="col ">Other Docs</th>
    </tr>
  </thead>
  <tbody>
  ${p.other_docs.url
    .map(
      (e) =>
        `
        <tr>
<td style="text-align:center; background: rgba(206, 197, 237, 0.2) "> ${process.env.SERVER_URL}${e} </td>  
</tr>
    `
    )
    .join('')} `
}
${
  p.test_report &&
  `
  <tr>
        <td align="center ">
  <table  
  style="width: 100%; text-align: center; border-collapse: collapse;  ">
  <thead>
    <tr style=
    "border-top: 1px solid #78858e; border-bottom: 1px solid #78858e; ">
      <th style="text-align:center; color: #7F56D9;  font-family: fantasy;  font-size:16px;  background: rgba(206, 197, 237, 0.1)" scope="col ">Test Reports</th>
    </tr>
  </thead>
  <tbody>
  ${p.test_report.url
    .map(
      (e) =>
        `
        <tr>
<td style="text-align:center ;background: rgba(206, 197, 237, 0.3) "> ${process.env.SERVER_URL}${e} </td>  
</tr>
    `
    )
    .join('')} `
}
</tbody>
`
    )
    .join('')}
  `
      )
      .join('')}
  </td>
  </tr>
  <tr>
  <td align="center " 
  style=" background: rgba(206, 197, 237, 0.1) ">
  <p align="center " 
  style=" color: #7F56D9; font-size: 24px; font-family: fantasy; margin:10px 0px 0px 0px; ">
   Documents Detail
  </p>
</td>
</tr> 
  ${request.documents
    .map(
      (item) =>
        `
        <div style=" background: rgba(206, 197, 237, 0.1)">
        <p align="center " style="color: #000; font-family: Verdana; margin:0 ">
      <span style= "color: #7F56D9; font-family: fantasy; "> Document Name:</span>${item.doc_id.name}
      </p>
      <p align="center " style="color: #000; font-family: Verdana; margin:0 ">
      <span style= "color: #7F56D9; font-family: fantasy; ">Document Name:</span>${item.doc_id.info}
      </p>
      <p align="center " style="color: #000; font-family: Verdana; margin:0 ">
      <span style= "color: #7F56D9; font-family: fantasy; ">Document Link:</span>
      </p>
      </div>
      ${item.url
        .map(
          (e) =>
            `
            <p align="center "style="color: #000; font-family: Verdana; ; text-align:center !important;
            border-bottom: 1px solid black;background: rgba(206, 197, 237, 0.3)
            ">
            ${process.env.SERVER_URL}${e}
            </p>
      `
        )
        .join('')}`
    )
    .join('')}
  
</table>
</body>
`;
};
