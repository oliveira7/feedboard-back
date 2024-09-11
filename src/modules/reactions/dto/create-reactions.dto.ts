export class CreateReactionsDto {
  readonly user_id: string;
  readonly post_id: string;
  readonly reaction_type: string;
}
