import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { File as MulterFile } from 'multer';
import { memoryStorage } from 'multer';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only images are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: MulterFile) {
    return this.storageService.uploadProductImage(file);
  }

  @Delete(':objectName')
  delete(@Param('objectName') objectName: string) {
    return this.storageService.deleteFile(objectName);
  }

  @Get()
  list() {
    return this.storageService.listFiles();
  }

  @Get('url/:objectName')
  getUrl(@Param('objectName') objectName: string) {
    return this.storageService.getPublicUrl(objectName);
  }
}