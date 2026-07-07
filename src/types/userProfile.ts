export type UserProfile = {
  id: number;
  name: string;
  email: string;
  password?: string; 
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
};

export type UpdateProfilePayload = Partial<{
  name: string;
  email: string;
  avatarUrl?: string;
}>;

export type UserProfileResponse = {
  data: UserProfile;
  statusCode: number;
};