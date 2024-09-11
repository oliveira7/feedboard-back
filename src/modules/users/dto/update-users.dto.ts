export class UpdateUsersDto {
  readonly name?: string;
  readonly email?: string;
  readonly password_hash?: string;
  readonly avatar_url?: string;
  readonly role?: string;
}
