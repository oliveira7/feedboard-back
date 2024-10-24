export interface InvitationsServiceInterface {
  validateToken(token: string): Promise<boolean>;
  decodeInvitationToken(token: string): Promise<string>;
}
