export class CreatePostDto {
  readonly user_id: string;
  readonly group_id?: string;
  readonly content: string;
  readonly media_urls?: { url: string; type: 'image' | 'video' }[];
}
