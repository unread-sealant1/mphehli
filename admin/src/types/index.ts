export interface Player {
  id: number;
  name: string;
  position: string;
  number?: number;
  bio?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
