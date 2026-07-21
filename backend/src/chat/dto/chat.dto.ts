import { IsArray, IsIn, IsString, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatMessageItemDto {
  @IsIn(['user', 'assistant'])
  role!: 'user' | 'assistant';

  @IsString()
  content!: string;
}

export class ChatMessageDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ChatMessageItemDto)
  messages!: ChatMessageItemDto[];
}