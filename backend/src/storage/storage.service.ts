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

    const endPoint =
      this.config.get<string>('MINIO_ENDPOINT') ??
      this.config.get<string>('MINIO_INTERNAL_ENDPOINT') ??
      'minio';
    const port = Number(this.config.get<string>('MINIO_PORT') ?? '9000');

    this.client = new Client({
      endPoint,
      port,
      useSSL: this.config.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: this.config.get<string>('MINIO_ACCESS_KEY')!,
      secretKey: this.config.get<string>('MINIO_SECRET_KEY')!,
    });
  }

  async onModuleInit() {
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      try {
        const exists = await this.client.bucketExists(this.bucket);

        if (!exists) {
          await this.client.makeBucket(this.bucket);
          console.log(`Bucket "${this.bucket}" created`);
        }

        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucket}/*`],
            },
          ],
        };

        await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy));
        console.log(`Bucket "${this.bucket}" is public-read`);
        return;
      } catch (error) {
        if (attempt === 5) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  async uploadProductImage(file: MulterFile) {
    try {
      const extension = file.originalname.split('.').pop();
      const objectName = `${randomUUID()}.${extension}`;

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
        url: this.getPublicUrl(objectName),
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

  getPublicUrl(objectName: string): string {
    const protocol = this.config.get<string>('MINIO_USE_SSL') === 'true' ? 'https' : 'http';
    const publicEndpoint = this.config.get<string>('MINIO_PUBLIC_ENDPOINT');
    const port = this.config.get<string>('MINIO_PORT');
    return `${protocol}://${publicEndpoint}:${port}/${this.bucket}/${objectName}`;
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