import { Type } from 'class-transformer';
import {
  IsBase64,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

enum TypeFile {
  IMAGE = 'image',
  VIDEO = 'video',
}

class MediaItem {
  @IsBase64()
  readonly base64: string;

  @IsIn([TypeFile.IMAGE, TypeFile.VIDEO])
  readonly type: TypeFile;
}

export class CreatePostDto {
  @IsOptional()
  @IsMongoId()
  readonly group_id?: string;

  @IsNotEmpty()
  readonly content: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MediaItem)
  readonly media?: MediaItem[];
}
