export type JWT_PAYLOAD = {
  id: number;
  name: string;
  role: number;
  profile: string;
  suspended: boolean;
  email: string;
  password: string;
  createdAt: Date;
};
