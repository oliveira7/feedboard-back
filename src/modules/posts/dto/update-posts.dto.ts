export class UpdatePostDto {
  readonly content?: string;
  readonly media_urls?: { url: string; type: 'image' | 'video' }[];
  readonly pinned?: boolean;
}
