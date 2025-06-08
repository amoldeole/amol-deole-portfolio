export interface User {
  _id: string; // Use 'id' instead of '_id' for consistency with AuthContextType
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePicture?: string;
  // Optionally, include these if needed elsewhere in your app:
  isActive?: boolean;
  lastLogin?: string;
  settings?: any;
  chatSettings?: any;
  isOnline?: boolean;
  contacts?: any[];
  lastSeen?: string;
  createdAt?: string;
  updatedAt?: string;
  permissions?: {
    canEdit?: boolean;
    canDelete?: boolean;
    canCreate?: boolean;
    canView?: boolean;
  };
}
