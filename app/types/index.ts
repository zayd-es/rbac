import { Role } from "@/app/generated/prisma"; 

export { Role };

export interface Team {
  id: string;
  name: string;
  description?: string | null;
  code?: string | null;
  members?: User[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role; 
  teamId?: string | null;
  team?: Team | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (formData: FormData) => Promise<void> | void;
  logout: () => Promise<void> | void;
  hasPermission: (requiredRole: Role) => boolean;
}