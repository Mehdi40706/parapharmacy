import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import type { File as MulterFile } from 'multer';

@Injectable()
export class StorageService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Uploads an image buffer directly to Cloudinary.
   * Returns objectName (the Cloudinary public_id) and the HTTPS URL.
   */
  async uploadProductImage(
    file: MulterFile,
    folder = 'parapharmacie/products',
  ) {
    return new Promise<{ objectName: string; url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error: UploadApiErrorResponse | undefined, result?: UploadApiResponse) => {
          if (error || !result) {
            console.error('Cloudinary upload error:', error);
            return reject(
              new InternalServerErrorException('Unable to upload image'),
            );
          }
          resolve({
            objectName: result.public_id,
            url: result.secure_url,
          });
        },
      );

      // Convert image buffer to a stream for Cloudinary
      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });
  }

  /**
   * Deletes an image by its Cloudinary public_id.
   */
  async deleteFile(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return {
        message: 'Deleted successfully',
      };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new InternalServerErrorException('Unable to delete image');
    }
  }

  /**
   * Generates or retrieves the secure HTTPS URL for an image.
   */
  getPublicUrl(publicId: string): string {
    return cloudinary.url(publicId, { secure: true });
  }

  /**
   * Lists uploaded image resources with an optional prefix/folder.
   */
  async listFiles(prefix = 'parapharmacie/products') {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix,
        max_results: 50,
      });
      return result.resources;
    } catch (error) {
      console.error('Cloudinary list error:', error);
      throw new InternalServerErrorException('Unable to list files');
    }
  }
}