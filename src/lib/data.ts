
export type UserRole = 'farmer' | 'exporter' | 'consumer' | 'supplier' | 'expert' | 'admin';

export type User = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  registrationTimestamp: string;
  expertiseCategory?: string;
  experienceYears?: number;
  bio?: string;
  location?: {
    village?: string;
    taluka?: string;
    district?: string;
    state?: string;
    pincode?: string;
    address?: string;
  };
};

export type Consultation = {
  id: string;
  farmerId: string;
  expertId: string;
  farmerName?: string;
  subject: string;
  message: string;
  preferredDate: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  createdAt: string;
};

export type ExpertArticle = {
  id: string;
  expertId: string;
  title: string;
  category: string;
  content: string;
  imageURL?: string;
  createdAt: string;
  updatedAt: string;
};

export type Machine = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageURL: string;
  retailerId: string;
  availability: boolean;
  approved: boolean;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageURL: string;
  retailerId: string;
  approved: boolean;
};

export type AgriProduct = {
  id: string;
  name: string;
  company: string;
  category: 'pesticides' | 'fertilizers' | 'insecticides' | 'seeds' | 'tools';
  type?: string;
  cropSuitable?: string;
  packSize?: string;
  price: number;
  stock: boolean;
  imageUrl: string;
};

export type Booking = {
  id: string;
  farmerId: string;
  machineId: string;
  retailerId: string;
  itemName: string;
  type: 'Machine' | 'Service';
  bookingDate: string; 
  totalCost: number;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
};

export type SoilTest = {
  id: string;
  farmerId: string;
  preferredDate: string; 
  location: string;
  status: string; 
  farmerName: string;
  farmerPhone: string;
}

export type Produce = {
  id: string;
  title: string;
  description: string;
  price: number; 
  quantity: number;
  unit: string; 
  imageURL: string;
  farmerId: string;
  status: 'Available' | 'Sold Out';
  approved: boolean;
};

export type Sale = {
  id: string;
  buyerId: string;
  sellerId: string;
  itemId: string;
  itemType: 'Product' | 'Produce';
  itemName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  saleDate: string; 
};

export type LivestockListing = {
  id: string;
  farmerId: string;
  category: 'dairy' | 'poultry';
  title: string;
  description: string;
  price: number;
  quantity: number;
  imageURL: string;
  createdAt: string;
  status: 'active' | 'sold';
};
