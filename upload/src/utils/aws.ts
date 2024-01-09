import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_REGION, AWS_BUCKET_NAME } from '../config';

import AWS from "aws-sdk";
import fs from "fs";

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID || '',
  secretAccessKey: AWS_SECRET_ACCESS_KEY || '',
  region: AWS_BUCKET_REGION || '',
});

const bucketName = AWS_BUCKET_NAME || '';
async function uploadS3File(filePath: string, newFileNameKey: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err: any, data: any) => {
      if (err) reject(err);
      // console.log("bucketName",data, bucketName, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_REGION)
      console.log("newFileNameKey", newFileNameKey, "filePath", filePath )
      const params: AWS.S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: newFileNameKey,
        Body: data,
        // ACL: 'public-read',
      };

      s3.upload(params, (s3Err: any, data: any) => {

        if (s3Err) reject(s3Err);
        console.log("data", data)
        resolve(data.Location);
      });
    });
  });
}

async function deleteS3File(newFileNameKey: string): Promise<void> {
  const params: AWS.S3.DeleteObjectRequest = {
    Bucket: bucketName,
    Key: newFileNameKey,
  };

  return s3.deleteObject(params).promise()
    .then(() => {
      console.log(`File deleted successfully: ${newFileNameKey}`);
    })
    .catch((err) => {
      console.error(`Error deleting file: ${newFileNameKey}`, err);
      throw err;
    });
}

export { uploadS3File, deleteS3File };