/**
 * Multer strategy to upload images
 * @author Yousuf Kalim
 */
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const s3 = new S3Client();

aws.config.update({
  secretAccessKey: process.env.S3_SECRET_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: 'eu-west-3'
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only DOCX PDF and EXCEL  is allowed!'), false);
  }
};

exports.upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'ezxport1',
    metadata: function (req, file, cb) {
      const fileName = file.originalname.replace(/\s+/g, '');
      cb(null, { fieldName: Date.now() + '-' + fileName });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    }
  }),
  // File size limit upto 8 mb
  limits: {
    fileSize: 1024 * 1024 * 8
  }
});

exports.Multerupload = multer({
  // to store images
  storage: multer.diskStorage({
    // Defining the path where we have to store the image
    destination: function (req, file, cb) {
      cb(null, './uploads'); // Callback
    },
    // Creating a unique filename to avoid duplication error
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Callback
    }
  }),
  // File size limit upto 15 mb
  limits: {
    fileSize: 1024 * 1024 * 15
  }
});

// exports.uploadBase64 = async (files) => {
//   // Create an s3 instance
//   const AWS = require('aws-sdk');
//   const s3 = new AWS.S3();
//   const filepaths = [];
//   for (let i = 0; i < files.length; i++) {
//     const base64 = files[i].url;
//     const filename = files[i].filename;
//     const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
//     const params = {
//       Bucket: 'ezxport1',
//       Key: `${filename.split(' ').join('').split('.')[0]}.${filename.split('.').pop()}}`, // type is not required
//       Body: base64Data,
//       ACL: 'public-read',
//       ContentEncoding: 'base64', // required
//       ContentType: `image/${filename.split('.').pop()}`, // required. Notice the back ticks
//     };
//     try {
//       const { Location } = await s3.upload(params).promise();
//       filepaths.push(Location);
//     } catch (error) {
//       return console.log('AWS Error', error);
//     }

//     console.log(Location);
//   }

//   return filepaths;
// };

exports.uploadBase64 = async files => {
  // Create an s3 instance
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3();
  const filepaths = [];
  for (let i = 0; i < files.length; i++) {
    const base64 = files[i].url;
    if (base64.includes('https://ezxport1.s3')) {
      filepaths.push(base64);
    } else {
      const filename = files[i].filename;
      const base64Data = new Buffer.from(base64, 'base64');
      const params = {
        Bucket: 'ezxport1',
        Key: `${Date.now()}-${filename.split(' ').join('').split('.')[0]}.${filename
          .split('.')
          .pop()}`, // type is not required
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64', // required
        ContentType: `image/${filename.split('.').pop()}` // required. Notice the back ticks
      };
      try {
        let data = await s3.upload(params).promise();
        filepaths.push(data.Location);
      } catch (err) {
        return console.log(err);
      }
    }
  }
  console.log(filepaths, 'filepaths');
  return filepaths;
};
