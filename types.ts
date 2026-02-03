
export enum AppView {
  HOME = 'home',
  FIND_SALONS = 'find_salons',
  AI_PREVIEW = 'ai_preview',
  PROFILE = 'profile',
  CONTACT = 'contact'
}

export interface Salon {
  id: string;
  name: string;
  location: string;
  city: string;
  category: string;
  rating: number;
  imageUrl: string;
  services: string[];
}

export interface BookingRequest {
  id: string;
  salonId: string;
  salonName: string;
  service: string;
  date: string;
  status: 'pending' | 'confirmed' | 'declined';
}

export interface UserProfile {
  name: string;
  phone: string;
  location: string;
}
