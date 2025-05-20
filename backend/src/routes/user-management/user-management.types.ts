import { User } from 'prisma/client';

export type FormattedUser = Omit<User, 'updatedAt' | 'createdAt'> & {
  createdAt: string;
  updatedAt: string;
  roles: string[];
};
