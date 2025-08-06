export interface Wrapper {
  _id?: string;
  modelNumber: string; // Added for easy ordering reference
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  likes?: number; // Make optional
  likedBy?: string[]; // Make optional
  isLateNightSpecial?: boolean;
  lateNightPrice?: number;
  scheduledDate?: Date;
  isVisible?: boolean; // Make optional
  isActive?: boolean; // Alternative to isVisible
  tags?: string[]; // Add tags field
  createdAt: Date;
  updatedAt?: Date; // Make optional
}

export interface Admin {
  _id?: string;
  username: string;
  password: string;
  createdAt: Date;
}

export interface UploadResponse {
  success: boolean;
  imageUrl?: string;
  message: string;
}

export interface LikeResponse {
  success: boolean;
  likes: number;
  message: string;
}
