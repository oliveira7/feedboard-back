enum Role {
  STUDENT = 'student',
  TEACHER = 'teacher',
  COORDINATOR = 'coordinator',
}

export class CreateUsersDto {
  readonly name: string;
  readonly course?: string;
  readonly description?: string;
  readonly email: string;
  readonly password_hash: string;
  readonly avatar_base64?: string;
  readonly role: Role;
}
