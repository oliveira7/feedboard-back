enum Role {
  STUDENT = 'student',
  TEACHER = 'teacher',
  COORDINATOR = 'coordinator',
}

export class CreateUsersDto {
  readonly name: string;
  readonly email: string;
  readonly password_hash: string;
  readonly avatar_url?: string;
  readonly role: Role;
}
