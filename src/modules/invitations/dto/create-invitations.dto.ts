export class CreateInvitationDto {
  readonly email: string;
  readonly token: string;
  readonly used: boolean;
  readonly expires_at: string;
}
