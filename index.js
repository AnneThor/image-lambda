const sharp = require('sharp');
const AWS = require('aws-sdk');

exports.handler = async function (event, context) {

  const s3 = new AWS.S3();
  console.log({event});
  // source bucket name
  const BUCKET = event.Records[0].s3.bucket.name;
  // destination bucket name
  const THUMBNAIL = "thora-thumbnails";
  // source image file name
  const KEY = event.Records[0].s3.object.key;
  // Key for destination
  const DEST_KEY = "thumbnail-" + KEY;
  try {
    let image = await s3.getObject({
      Bucket: BUCKET,
      Key: KEY
    }).promise();
    image = await sharp(image.Body);
    const thumbnail = await image.resize({width: 200}).toBuffer();
    await s3.putObject({
      Bucket: THUMBNAIL,
      Body: thumbnail,
      Key: DEST_KEY
    }).promise();
    return;
  } catch (err) {
    context.fail(`Error resizing image: ${err}`);
    return;
  }

  console.log(`Successfully resized ${BUCKET}/${KEY} and uploaded to ${THUMBNAIL}/${DEST_KEY}`);

}
