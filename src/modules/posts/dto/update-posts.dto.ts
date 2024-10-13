export class UpdatePostDto {
  readonly content?: string;
  readonly media?: { base64: string; type: 'image' | 'video' }[];
  readonly pinned?: boolean;
}
