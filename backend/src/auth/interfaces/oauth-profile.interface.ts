export type OAuthProvider = 'google' | 'facebook';

export interface OAuthProfile {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}