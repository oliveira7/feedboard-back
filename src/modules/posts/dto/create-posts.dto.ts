export class CreatePostDto {
  readonly user_id: string;
  readonly group_id?: string;
  readonly content: string;
  readonly media?: { base64: string; type: 'image' | 'video' }[];
}
