'use strict';

const sharp = require('sharp');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

require('dotenv').config();

exports.handler = async (event, context) => {
  if (events.Records[0].eventName !== "ObjectCreated:Put") {
    return;
  }
  // source bucket name
  const BUCKET = event.Records[0].s3.bucket.name;
  // destination bucket name
  const THUMBNAIL = THORA_THUMBNAIL;
  // source image file name
  const KEY = event.Records[0].s3.object.key;
  // Key for destination
  const DEST_KEY = "thumbnail-" + KEY;
  try {
    let image = await s3.getObject({
      Bucket: BUCKET,
      Key: KEY
    }).promise();
    image = await.sharp(image.Body);
    // const metadata = await image.metadata();
    const thumbnail = await image.resize({width: 200}).toBuffer();
    await s3.putObject({
      BUCKET: THUMBNAIL,
      Body: resizedImage,
      Key: DEST_KEY
    }).promise();
    return;
  } catch (err) {
    context fail(`Error resizing image: ${err}`);
  }

  console.log(`Successfully resized ${BUCKET}/${KEY} and uploaded to ${THUMBNAIL}/${DEST_KEY}`);

}
