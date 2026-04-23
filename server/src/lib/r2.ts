import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";

const r2EnvSchema = z.object({
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1),
  CLOUDFLARE_BUCKET: z.string().min(1),
  CLOUDFLARE_PUBLIC_URL: z.string().url(),
});

const getR2Config = () => {
  const config = r2EnvSchema.parse(process.env);
  const endpoint = `https://${config.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId: config.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: config.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
  });

  return { client, config };
};

const joinPublicUrl = (baseUrl: string, key: string) => {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const normalizedKey = key.replace(/^\/+/, "");

  return `${normalizedBaseUrl}/${normalizedKey}`;
};

export const uploadFileToR2 = async (key: string, body: string) => {
  const { client, config } = getR2Config();

  await client.send(
    new PutObjectCommand({
      Bucket: config.CLOUDFLARE_BUCKET,
      Key: key,
      Body: body,
      ContentType: "text/csv; charset=utf-8",
    }),
  );

  return {
    key,
    url: joinPublicUrl(config.CLOUDFLARE_PUBLIC_URL, key),
  };
};
