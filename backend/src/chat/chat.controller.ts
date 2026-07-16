import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  send(@Body() dto: ChatMessageDto) {
    return this.chatService.sendMessage(dto.messages);
  }
}