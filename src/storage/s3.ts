import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


const s3Client = new S3Client({
    endpoint: process.env["S3_ENDPOINT"],
    region: process.env["S3_REGION"],
    forcePathStyle: process.env["S3_FORCE_PATH_STYLE"]  !== "false",
    credentials: {
        accessKeyId: process.env["S3_ACCESS_KEY_ID"] as string,
        secretAccessKey: process.env["S3_SECRET_ACCESS_KEY"] as string,
    }
});

const BUCKET = process.env["S3_BUCKET"];

export const fileJsong =async (key: string, data: unknown) => {
    const body = JSON.stringify(data);
    await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET, Key: key, Body: body, ContentType: "application/json"
    }));
    return {bucket: BUCKET, key: key};
};