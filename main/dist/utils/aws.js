"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePresignedUrl = exports.deleteS3File = exports.uploadS3File = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../config");
const s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: config_1.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: config_1.AWS_SECRET_ACCESS_KEY || '',
    },
    region: config_1.AWS_BUCKET_REGION || '',
});
const bucketName = config_1.AWS_BUCKET_NAME || '';
async function generatePresignedUrl(key) {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    const url = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 604800 });
    return url;
}
exports.generatePresignedUrl = generatePresignedUrl;
async function uploadS3File(filePath, newFileNameKey) {
    return new Promise((resolve, reject) => {
        const fileStream = fs_1.default.createReadStream(filePath);
        const params = {
            Bucket: bucketName,
            Key: newFileNameKey,
            Body: fileStream,
        };
        s3Client.send(new client_s3_1.PutObjectCommand(params))
            .then(() => generatePresignedUrl(newFileNameKey))
            .then((url) => {
            console.log(url);
            resolve(url);
        })
            .catch((err) => {
            console.error(`Error uploading file: ${err.message}`);
            reject(err);
        });
    });
}
exports.uploadS3File = uploadS3File;
async function deleteS3File(newFileNameKey) {
    const params = new client_s3_1.DeleteObjectCommand({
        Bucket: bucketName,
        Key: newFileNameKey,
    });
    return s3Client.send(params)
        .then(() => {
        console.log(`File deleted successfully: ${newFileNameKey}`);
    })
        .catch((err) => {
        console.error(`Error deleting file: ${newFileNameKey}, ${err.message}`);
        throw err;
    });
}
exports.deleteS3File = deleteS3File;
