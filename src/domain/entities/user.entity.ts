export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public role: string,
    public avatarUrl: string,
    public passwordHash: string,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date
  ) {}
}
