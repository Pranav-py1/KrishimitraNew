
export type UserRole = 'farmer' | 'exporter' | 'consumer' | 'supplier' | 'service_provider' | 'admin';

export type User = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  registrationTimestamp: string;
  aadhaar?: string;
  crops?: string[];
  farmingType?: 'Organic' | 'Conventional' | 'Mixed';
  landArea?: number;
  landUnit?: 'Acres' | 'Hectares';
  irrigationType?: 'Rain-fed' | 'Borewell' | 'Canal' | 'Drip Irrigation' | 'Sprinkler';
  experienceYears?: number;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  occupation?: string;
  householdSize?: number;
  location?: {
    village?: string;
    taluka?: string;
    district?: string;
    state?: string;
    pincode?: string;
    address?: string;
  };
  bankDetails?: {
    accountHolder?: string;
    bankName?: string;
    ifsc?: string;
    accountNumber?: string;
  };
  purchasePreferences?: {
    productCategories?: string[];
    purchaseFrequency?: string;
    purchaseMode?: string;
    organicPreference?: boolean;
  };
  paymentPreferences?: {
    paymentMethods?: string[];
    upiId?: string;
  };
  documents?: {
    landProofURL?: string;
    profilePhotoURL?: string;
  };
  preferredLanguage?: 'Marathi' | 'Hindi' | 'English' | 'Other';
  shopDetails?: {
    name: string;
    gst?: string;
    address: string;
    description?: string;
  };
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
  bookingDate: string; // Stored as YYYY-MM-DD
  totalCost: number;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
};

export type SoilTest = {
  id: string;
  farmerId: string;
  preferredDate: string; // ISO String
  location: string;
  status: string; // 'Pending', 'Completed', etc.
  farmerName: string;
  farmerPhone: string;
}

export type Produce = {
  id: string;
  title: string;
  description: string;
  price: number; // per unit
  quantity: number;
  unit: string; // e.g. 'kg', 'quintal'
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
  saleDate: string; // ISO string
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
