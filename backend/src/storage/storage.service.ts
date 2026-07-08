import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { randomUUID } from 'crypto';
import type { File as MulterFile } from 'multer';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly client: Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('MINIO_BUCKET')!;

    this.client = new Client({
      endPoint: this.config.get<string>('MINIO_ENDPOINT')!,
      port: Number(this.config.get<number>('MINIO_PORT')),
      useSSL: this.config.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: this.config.get<string>('MINIO_ACCESS_KEY')!,
      secretKey: this.config.get<string>('MINIO_SECRET_KEY')!,
    });
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);

    if (!exists) {
      await this.client.makeBucket(this.bucket);
      console.log(`Bucket "${this.bucket}" created`);
    }
  }

  async uploadProductImage(file: MulterFile) {
    try {
      const extension = file.originalname.split('.').pop();

      const objectName = `products/${randomUUID()}.${extension}`;

      await this.client.putObject(
        this.bucket,
        objectName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      return {
        objectName,
        url: await this.getPresignedUrl(objectName),
      };
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException(
        'Unable to upload image',
      );
    }
  }

  async deleteFile(objectName: string) {
    await this.client.removeObject(this.bucket, objectName);

    return {
      message: 'Deleted successfully',
    };
  }

  async getPresignedUrl(objectName: string) {
    return await this.client.presignedGetObject(
      this.bucket,
      objectName,
      60 * 60,
    );
  }

  async listFiles(prefix = 'products/') {
    return new Promise<any[]>((resolve, reject) => {
      const objects: any[] = [];

      const stream = this.client.listObjects(
        this.bucket,
        prefix,
        true,
      );

      stream.on('data', obj => objects.push(obj));

      stream.on('end', () => resolve(objects));

      stream.on('error', reject);
    });
  }
}