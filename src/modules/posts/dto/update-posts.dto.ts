import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsOptional, IsString, ValidateNested } from "class-validator";

class MediaItem {
  @IsString()
  base64: string;

  @IsIn(['image', 'video'])
  type: 'image' | 'video';
}

export class UpdatePostDto {
  @IsOptional()
  readonly content?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MediaItem)
  readonly media?: MediaItem[];
  
  @IsOptional()
  @IsBoolean()
  readonly pinned?: boolean;
}
