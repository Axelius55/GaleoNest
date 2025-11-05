import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AwsService {
  private s3 = new S3Client({
    region: 'us-east-2', 
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_BUCKET ?? '',
      secretAccessKey: process.env.SECRET_KEY_BUCKET ?? '',
    },
  });

  private readonly bucket = 'galeonest-s3-cloud';

  async uploadFile(file: Express.Multer.File) {
    const extension = file.originalname.split('.').pop();
    const fileName = `${uuid()}.${extension}`;
    const key = `usuarios/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    // URL pública
    const url = `https://${this.bucket}.s3.us-east-2.amazonaws.com/${key}`;
    return { url, fileName };
  }
}
