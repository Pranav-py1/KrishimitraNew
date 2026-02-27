'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, UserPlus, ShieldCheck, Wheat, Store, User, Truck, Wrench, CheckCircle2, ArrowRight, ArrowLeft, CalendarIcon, MapPin } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/components/language-provider';

const translations = {
  en: {
    language: 'English',
    title: 'Register with KrishiMitra',
    description: 'Create your account to join KrishiMitra community.',
    stepTitle: (role: string, step: number) => `${role.charAt(0).toUpperCase() + role.slice(1)} Registration - Step ${step}`,
    sectionName: (role: string, step: number) => {
        if (role === 'farmer') {
             return ['Basic Details', 'Farming Details', 'Location Details', 'Bank Details', 'Optional Details'][step - 1];
         } else if (role === 'consumer') {
             return ['Basic Details', 'Personal Details', 'Delivery Details', 'Purchase Preferences', 'Payment & Optional'][step - 1];
         }
         return '';
    },
    fullNameLabel: 'Full Name *',
    fullNamePlaceholder: 'Enter your full name',
    registeringAsLabel: 'Registering as',
    emailLabel: 'Email Address *',
    emailPlaceholder: 'you@example.com',
    phoneLabel: 'Phone Number *',
    phonePlaceholder: '10-digit number',
    passwordLabel: 'Password *',
    passwordPlaceholder: 'Minimum 6 characters',
    aadhaarLabel: 'Aadhaar Number',
    aadhaarOptional: '(Optional)',
    aadhaarRequired: '*',
    aadhaarDescription: 'Your Aadhaar is stored securely.',
    primaryCropsLabel: 'Primary Crops',
    primaryCropsPlaceholder: 'e.g., Wheat, Rice, Sugarcane',
    primaryCropsDescription: 'Comma separated list of crops you grow.',
    farmingTypeLabel: 'Farming Type',
    landAreaLabel: 'Land Area',
    landUnitLabel: 'Unit',
    irrigationTypeLabel: 'Irrigation Type',
    experienceLabel: 'Experience (Years)',
    dobLabel: 'Date of Birth',
    pickADate: 'Pick a date',
    genderLabel: 'Gender',
    occupationLabel: 'Occupation',
    occupationPlaceholder: 'e.g., Engineer, Teacher',
    householdSizeLabel: 'Household Size',
    householdSizeDescription: 'Number of family members.',
    residentialAddressLabel: 'Detailed Delivery Address',
    residentialAddressPlaceholder: 'House No, Building, Street, Landmark',
    villageLabel: 'Village / Locality',
    talukaLabel: 'Taluka / Block',
    districtLabel: 'District',
    stateLabel: 'State',
    pincodeLabel: 'Pincode',
    bankHolderLabel: 'Bank Account Holder Name',
    bankNameLabel: 'Bank Name',
    ifscLabel: 'IFSC Code',
    accountNumberLabel: 'Account Number',
    productCategoriesLabel: 'Preferred Product Categories',
    purchaseFrequencyLabel: 'Purchase Frequency',
    purchaseModeLabel: 'Preferred Purchase Mode',
    organicPreferenceLabel: 'Interested in Organic Products',
    organicPreferenceDescription: 'Show me more organic farm produce.',
    paymentMethodsLabel: 'Preferred Payment Methods',
    upiIdLabel: 'UPI ID (Optional)',
    upiIdPlaceholder: 'username@bank',
    preferredLanguageLabel: 'Preferred Language',
    readyToJoin: 'Ready to Join KrishiMitra',
    profileCreatedMessage: "Your profile will be created and you'll be redirected shortly.",
    nextButton: 'Next',
    previousButton: 'Previous',
    finishRegistrationButton: 'Finish Registration',
    detectLocation: 'Detect My Location',
    detecting: 'Locating...',
    createAccountButton: (role: string) => `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`,
    selectValues: {
        roles: { farmer: 'Farmer', exporter: 'Exporter', consumer: 'Consumer', supplier: 'Supplier', service_provider: 'Service Provider' },
        farmingTypes: { Organic: 'Organic', Conventional: 'Conventional', Mixed: 'Mixed' },
        landUnits: { Acres: 'Acres', Hectares: 'Hectares' },
        irrigationTypes: { 'Rain-fed': 'Rain-fed', Borewell: 'Borewell', Canal: 'Canal', 'Drip Irrigation': 'Drip Irrigation', Sprinkler: 'Sprinkler' },
        genders: { Male: 'Male', Female: 'Female', Other: 'Other', 'Prefer not to say': 'Prefer not to say' },
        purchaseFrequencies: { Daily: 'Daily', Weekly: 'Weekly', Monthly: 'Monthly', Occasionally: 'Occasionally' },
        purchaseModes: { 'Direct from Farmers': 'Direct from Farmers', 'Dealers / Shops': 'Dealers / Shops', 'Online Delivery': 'Online Delivery' },
        languages: { English: 'English', Hindi: 'Hindi', Marathi: 'Marathi', Other: 'Other Regional Languages' },
        productCategories: { Fruits: 'Fruits', Vegetables: 'Vegetables', Grains: 'Grains', 'Dairy Products': 'Dairy Products', 'Organic Products': 'Organic Products', 'Seeds for Home Gardening': 'Seeds for Home Gardening', 'Garden Supplies': 'Garden Supplies' },
        paymentMethods: { Cash: 'Cash', UPI: 'UPI', 'Debit / Credit Card': 'Debit / Credit Card', 'Net Banking': 'Net Banking' }
    }
  },
  mr: {
    language: 'मराठी',
    title: 'कृषिमित्र मध्ये नोंदणी करा',
    description: 'कृषिमित्र समुदायात सामील होण्यासाठी आपले खाते तयार करा.',
    stepTitle: (role: string, step: number) => {
        const roles: any = { farmer: 'शेतकरी', consumer: 'ग्राहक', exporter: 'निर्यातदार', supplier: 'पुरवठादार', service_provider: 'सेवा प्रदाता'};
        return `${roles[role]} नोंदणी - पायरी ${step}`;
    },
    sectionName: (role: string, step: number) => {
        if (role === 'farmer') {
             return ['मूलभूत माहिती', 'शेती तपशील', 'स्थानाचा तपशील', 'बँक तपशील', 'ऐच्छिक तपशील'][step - 1];
         } else if (role === 'consumer') {
             return ['मूलभूत माहिती', 'वैयक्तिक तपशील', 'वितरण तपशील', 'खरेदी प्राधान्ये', 'पेमेंट आणि ऐच्छिक'][step - 1];
         }
         return '';
    },
    fullNameLabel: 'पूर्ण नाव *',
    fullNamePlaceholder: 'तुमचे पूर्ण नाव टाका',
    registeringAsLabel: 'म्हणून नोंदणी करत आहे',
    emailLabel: 'ई-मेल पत्ता *',
    emailPlaceholder: 'तुमची@उदाहरण.कॉम',
    phoneLabel: 'फोन नंबर *',
    phonePlaceholder: '१०-अंकी क्रमांक',
    passwordLabel: 'पासवर्ड *',
    passwordPlaceholder: 'किमान ६ अक्षरे',
    aadhaarLabel: 'आधार क्रमांक',
    aadhaarOptional: '(ऐच्छिक)',
    aadhaarRequired: '*',
    aadhaarDescription: 'तुमचा आधार सुरक्षितपणे साठवला जातो.',
    primaryCropsLabel: 'मुख्य पिके',
    primaryCropsPlaceholder: 'उदा. गहू, तांदूळ, ऊस',
    primaryCropsDescription: 'तुमची घेत असलेल्या पिकांची स्वल्पविरामाने विभक्त केलेली यादी.',
    farmingTypeLabel: 'शेतीचा प्रकार',
    landAreaLabel: 'जमीन क्षेत्र',
    landUnitLabel: 'एकक',
    irrigationTypeLabel: 'सिंचनाचा प्रकार',
    experienceLabel: 'अनुभव (वर्षे)',
    dobLabel: 'जन्म तारीख',
    pickADate: 'एक तारीख निवडा',
    genderLabel: 'लिंग',
    occupationLabel: 'व्यवसाय',
    occupationPlaceholder: 'उदा. अभियंता, शिक्षक',
    householdSizeLabel: 'कुटुंबाचा आकार',
    householdSizeDescription: 'कुटुंबातील सदस्यांची संख्या.',
    residentialAddressLabel: 'सविस्तर डिलिव्हरी पत्ता',
    residentialAddressPlaceholder: 'घर क्रमांक, इमारत, रस्ता, खूण',
    villageLabel: 'गाव / परिसर',
    talukaLabel: 'तालुका / ब्लॉक',
    districtLabel: 'जिल्हा',
    stateLabel: 'राज्य',
    pincodeLabel: 'पिनकोड',
    bankHolderLabel: 'बँक खातेधारकाचे नाव',
    bankNameLabel: 'बँकेचे नाव',
    ifscLabel: 'IFSC कोड',
    accountNumberLabel: 'खाते क्रमांक',
    productCategoriesLabel: 'पसंतीचे उत्पादन प्रकार',
    purchaseFrequencyLabel: 'खरेदीची वारंवारता',
    purchaseModeLabel: 'पसंतीची खरेदी पद्धत',
    organicPreferenceLabel: 'सेंद्रिय उत्पादनांमध्ये रस आहे',
    organicPreferenceDescription: 'मला अधिक सेंद्रिय शेतमाल दाखवा.',
    paymentMethodsLabel: 'पसंतीची पेमेंट पद्धत',
    upiIdLabel: 'UPI आयडी (ऐच्छिक)',
    upiIdPlaceholder: 'वापरकर्तानाव@बँक',
    preferredLanguageLabel: 'पसंतीची भाषा',
    readyToJoin: 'कृषिमित्रमध्ये सामील होण्यासाठी सज्ज',
    profileCreatedMessage: 'तुमचे प्रोफाइल तयार केले जाईल आणि तुम्हाला लवकरच पुनर्निर्देशित केले जाईल.',
    nextButton: 'पुढे',
    previousButton: 'मागे',
    finishRegistrationButton: 'नोंदणी पूर्ण करा',
    detectLocation: 'माझे स्थान शोधा',
    detecting: 'शोधत आहे...',
    createAccountButton: (role: string) => {
        const roles: any = { farmer: 'शेतकरी', exporter: 'निर्यातदार', consumer: 'ग्राहक', supplier: 'पुरवठादार', service_provider: 'सेवा प्रदाता'};
        return `${roles[role]} खाते तयार करा`;
    },
    selectValues: {
        roles: { farmer: 'शेतकरी', exporter: 'निर्यातदार', consumer: 'ग्राहक', supplier: 'पुरवठादार', service_provider: 'सेवा प्रदाता' },
        farmingTypes: { Organic: 'सेंद्रिय', Conventional: 'पारंपारिक', Mixed: 'मिश्र' },
        landUnits: { Acres: 'एकर', Hectares: 'हेक्टर' },
        irrigationTypes: { 'Rain-fed': 'पर्जन्य-आधारित', Borewell: 'बोरवेल', Canal: 'कालवा', 'Drip Irrigation': 'ठिबक सिंचन', Sprinkler: 'तुषार सिंचन' },
        genders: { Male: 'पुरुष', Female: 'स्त्री', Other: 'इतर', 'Prefer not to say': 'सांगायचे नाही' },
        purchaseFrequencies: { Daily: 'दररोज', Weekly: 'साप्ताहिक', Monthly: 'मासिक', Occasionally: 'अधूनमधून' },
        purchaseModes: { 'Direct from Farmers': 'थेट शेतकऱ्यांकडून', 'Dealers / Shops': 'विक्रेते / दुकाने', 'Online Delivery': 'ऑनलाइन डिलिव्हरी' },
        languages: { English: 'इंग्रजी', Hindi: 'हिंदी', Marathi: 'मराठी', Other: 'इतर प्रादेशिक भाषा' },
        productCategories: { Fruits: 'फळे', Vegetables: 'भाज्या', Grains: 'धान्ये', 'Dairy Products': 'दुग्धजन्य पदार्थ', 'Organic Products': 'सेंद्रिय उत्पादने', 'Seeds for Home Gardening': 'बागकामासाठी बियाणे', 'Garden Supplies': 'बागकाम साहित्य' },
        paymentMethods: { Cash: 'रोख', UPI: 'UPI', 'Debit / Credit Card': 'डेबिट / क्रेडिट कार्ड', 'Net Banking': 'नेट बँकिंग' }
    }
  },
};


const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const registrationSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  phone: z.string().length(10, { message: 'Phone number must be exactly 10 digits.' }),
  role: z.enum(['farmer', 'exporter', 'consumer', 'supplier', 'service_provider']),
  aadhaar: z.string().optional().refine((val) => !val || val.length === 12, { message: 'Aadhaar must be 12 digits.' }),
  village: z.string().optional(),
  taluka: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional().refine((val) => !val || val.length === 6, { message: 'Pincode must be 6 digits.' }),
  crops: z.string().optional(),
  farmingType: z.enum(['Organic', 'Conventional', 'Mixed']).optional(),
  landArea: z.coerce.number().optional(),
  landUnit: z.enum(['Acres', 'Hectares']).optional(),
  irrigationType: z.enum(['Rain-fed', 'Borewell', 'Canal', 'Drip Irrigation', 'Sprinkler']).optional(),
  experienceYears: z.coerce.number().optional(),
  accountHolder: z.string().optional(),
  bankName: z.string().optional(),
  ifsc: z.string().optional(),
  accountNumber: z.string().optional(),
  dob: z.date().optional(),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  occupation: z.string().optional(),
  householdSize: z.coerce.number().optional(),
  address: z.string().optional(),
  productCategories: z.array(z.string()).default([]),
  purchaseFrequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Occasionally']).optional(),
  purchaseMode: z.enum(['Direct from Farmers', 'Dealers / Shops', 'Online Delivery']).optional(),
  organicPreference: z.boolean().default(false),
  paymentMethods: z.array(z.string()).default([]),
  upiId: z.string().optional(),
  preferredLanguage: z.enum(['Marathi', 'Hindi', 'English', 'Other']).optional(),
  shopName: z.string().optional(),
  shopAddress: z.string().optional(),
  gstNumber: z.string().optional(),
  serviceDetails: z.string().optional(),
});

type RegistrationValues = z.infer<typeof registrationSchema>;

const roleIcons: Record<string, any> = {
  farmer: Wheat,
  exporter: Truck,
  consumer: User,
  supplier: Store,
  service_provider: Wrench,
};

function RegistrationForm() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, isUserLoading } = useUser();

  const userDocRef = useMemoFirebase(() => currentUser ? doc(firestore, 'users', currentUser.uid) : null, [currentUser, firestore]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const initialRole = (searchParams.get('role') as RegistrationValues['role']) || 'farmer';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isUserLoading || isUserDataLoading || isLoading) return;

    if (currentUser && userData?.role) {
      if (userData.role === initialRole) {
        const normalizedRole = userData.role.trim().toLowerCase().replace('_', '-');
        router.push(`/dashboard/${normalizedRole}`);
      }
    }
  }, [currentUser, userData, isUserLoading, isUserDataLoading, router, mounted, isLoading, initialRole]);

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      role: initialRole,
      aadhaar: '',
      crops: '',
      farmingType: 'Mixed',
      landArea: 0,
      landUnit: 'Acres',
      irrigationType: 'Rain-fed',
      experienceYears: 0,
      village: '',
      taluka: '',
      district: '',
      state: 'Maharashtra',
      pincode: '',
      accountHolder: '',
      bankName: '',
      ifsc: '',
      accountNumber: '',
      preferredLanguage: 'English',
      shopName: '',
      shopAddress: '',
      gstNumber: '',
      serviceDetails: '',
      gender: 'Prefer not to say',
      occupation: '',
      householdSize: 1,
      address: '',
      productCategories: [],
      purchaseFrequency: 'Weekly',
      purchaseMode: 'Online Delivery',
      organicPreference: false,
      paymentMethods: [],
      upiId: '',
    },
  });

  const selectedRole = form.watch('role');
  const RoleIcon = roleIcons[selectedRole] || UserPlus;
  const steps = (selectedRole === 'farmer' || selectedRole === 'consumer') ? 5 : 1;
  const progress = (step / steps) * 100;

  async function onSubmit(values: RegistrationValues) {
    setIsLoading(true);
    try {
      if (!auth || !firestore) throw new Error("Firebase services are not available");
      
      let user = currentUser;
      if (!user) {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        user = userCredential.user;
      }

      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const newProfileData: any = {
          id: user.uid,
          name: values.fullName || '',
          email: values.email || '',
          phone: values.phone || '',
          role: values.role,
          registrationTimestamp: new Date().toISOString(),
          preferredLanguage: values.preferredLanguage || 'English',
        };

        if (values.role === 'farmer') {
          Object.assign(newProfileData, {
            aadhaar: values.aadhaar || '',
            crops: values.crops ? values.crops.split(',').map(s => s.trim()) : [],
            farmingType: values.farmingType || 'Mixed',
            landArea: values.landArea || 0,
            landUnit: values.landUnit || 'Acres',
            irrigationType: values.irrigationType || 'Rain-fed',
            experienceYears: values.experienceYears || 0,
            location: { 
              village: values.village || '', 
              taluka: values.taluka || '', 
              district: values.district || '', 
              state: values.state || 'Maharashtra', 
              pincode: values.pincode || '' 
            },
            bankDetails: { 
              accountHolder: values.accountHolder || '', 
              bankName: values.bankName || '', 
              ifsc: values.ifsc || '', 
              accountNumber: values.accountNumber || '' 
            },
            documents: { landProofURL: '', profilePhotoURL: `https://picsum.photos/seed/${user.uid}/200/200` }
          });
        } else if (values.role === 'consumer') {
           Object.assign(newProfileData, {
            aadhaar: values.aadhaar || '',
            dob: values.dob ? values.dob.toISOString().split('T')[0] : null,
            gender: values.gender || 'Prefer not to say',
            occupation: values.occupation || '',
            householdSize: values.householdSize || 1,
            location: { 
              address: values.address || '', 
              village: values.village || '', 
              taluka: values.taluka || '', 
              district: values.district || '', 
              state: values.state || 'Maharashtra', 
              pincode: values.pincode || '' 
            },
            purchasePreferences: { 
              productCategories: values.productCategories || [], 
              purchaseFrequency: values.purchaseFrequency || 'Weekly', 
              purchaseMode: values.purchaseMode || 'Online Delivery', 
              organicPreference: values.organicPreference || false 
            },
            paymentPreferences: { 
              paymentMethods: values.paymentMethods || [], 
              upiId: values.upiId || '' 
            },
            documents: { profilePhotoURL: `https://picsum.photos/seed/${user.uid}/200/200` }
          });
        } else if (values.role === 'exporter' || values.role === 'supplier') {
          newProfileData.shopDetails = { 
            name: values.shopName || '', 
            address: values.shopAddress || '', 
            gst: values.gstNumber || '' 
          };
        } else if (values.role === 'service_provider') {
          newProfileData.serviceDetails = values.serviceDetails || '';
        }

        await setDoc(userDocRef, newProfileData, { merge: true });
        toast({ title: 'Registration Successful!', description: `Welcome to KrishiMitra, ${values.fullName}. Your profile is complete.` });
        
        const normalizedRole = values.role.trim().toLowerCase().replace('_', '-');
        router.push(`/dashboard/${normalizedRole}`);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Registration Failed', description: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: 'Error', description: 'Geolocation is not supported by your browser.' });
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          if (data.address) {
            const addr = data.address;
            form.setValue('village', addr.suburb || addr.neighbourhood || addr.village || addr.city_district || '');
            form.setValue('taluka', addr.county || '');
            form.setValue('district', addr.state_district || addr.city || '');
            form.setValue('state', addr.state || 'Maharashtra');
            form.setValue('pincode', addr.postcode || '');
            form.setValue('address', data.display_name || '');
            
            toast({ title: 'Location Detected', description: 'Address fields have been updated based on your location.' });
          }
        } catch (err) {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch address from coordinates.' });
        } finally {
          setIsDetectingLocation(false);
        }
      },
      () => {
        toast({ variant: 'destructive', title: 'Error', description: 'Location access denied. Please fill fields manually.' });
        setIsDetectingLocation(false);
      }
    );
  };

  const nextStep = () => setStep(s => Math.min(s + 1, steps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (!mounted || isUserLoading || isUserDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const productCategories = Object.entries(t.selectValues.productCategories).map(([id, label]) => ({ id: id, label: label as string }));
  const paymentMethods = Object.entries(t.selectValues.paymentMethods).map(([id, label]) => ({ id: id, label: label as string }));

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12">
      <Card className="shadow-lg border-2 border-primary/10 overflow-hidden">
        {steps > 1 && (
          <div className="h-1 w-full bg-secondary">
            <Progress value={progress} className="h-full rounded-none" />
          </div>
        )}
        <CardHeader className="text-center pt-8">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <RoleIcon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">
            {steps > 1 ? t.stepTitle(selectedRole, step) : t.title}
          </CardTitle>
          <CardDescription>
            {steps > 1 ? `${t.sectionName(selectedRole, step)}` : t.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.fullNameLabel}</FormLabel>
                        <FormControl><Input placeholder={t.fullNamePlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="role" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.registeringAsLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={true}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="farmer">{t.selectValues.roles.farmer}</SelectItem>
                            <SelectItem value="exporter">{t.selectValues.roles.exporter}</SelectItem>
                            <SelectItem value="consumer">{t.selectValues.roles.consumer}</SelectItem>
                            <SelectItem value="supplier">{t.selectValues.roles.supplier}</SelectItem>
                            <SelectItem value="service_provider">{t.selectValues.roles.service_provider}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.emailLabel}</FormLabel>
                        <FormControl><Input placeholder={t.emailPlaceholder} type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.phoneLabel}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">+91</span>
                            <Input placeholder={t.phonePlaceholder} {...field} className="pl-11" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.passwordLabel}</FormLabel>
                      <FormControl><Input placeholder={t.passwordPlaceholder} type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {(selectedRole === 'farmer' || selectedRole === 'consumer') && (
                    <FormField control={form.control} name="aadhaar" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.aadhaarLabel} {selectedRole === 'consumer' ? t.aadhaarOptional : t.aadhaarRequired}</FormLabel>
                        <FormControl><Input placeholder="12-digit Aadhaar" {...field} /></FormControl>
                        <FormDescription>{t.aadhaarDescription}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>
              )}

              {selectedRole === 'farmer' && step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <FormField control={form.control} name="crops" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.primaryCropsLabel}</FormLabel>
                      <FormControl><Input placeholder={t.primaryCropsPlaceholder} {...field} /></FormControl>
                      <FormDescription>{t.primaryCropsDescription}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="farmingType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.farmingTypeLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Organic">{t.selectValues.farmingTypes.Organic}</SelectItem>
                            <SelectItem value="Conventional">{t.selectValues.farmingTypes.Conventional}</SelectItem>
                            <SelectItem value="Mixed">{t.selectValues.farmingTypes.Mixed}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-2">
                       <FormField control={form.control} name="landArea" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.landAreaLabel}</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                      )} />
                       <FormField control={form.control} name="landUnit" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.landUnitLabel}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="Acres">{t.selectValues.landUnits.Acres}</SelectItem>
                              <SelectItem value="Hectares">{t.selectValues.landUnits.Hectares}</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="irrigationType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.irrigationTypeLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Rain-fed">{t.selectValues.irrigationTypes["Rain-fed"]}</SelectItem>
                            <SelectItem value="Borewell">{t.selectValues.irrigationTypes.Borewell}</SelectItem>
                            <SelectItem value="Canal">{t.selectValues.irrigationTypes.Canal}</SelectItem>
                            <SelectItem value="Drip Irrigation">{t.selectValues.irrigationTypes["Drip Irrigation"]}</SelectItem>
                            <SelectItem value="Sprinkler">{t.selectValues.irrigationTypes.Sprinkler}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="experienceYears" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.experienceLabel}</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              )}

              {selectedRole === 'consumer' && step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t.dobLabel}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>{t.pickADate}</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.genderLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Male">{t.selectValues.genders.Male}</SelectItem>
                            <SelectItem value="Female">{t.selectValues.genders.Female}</SelectItem>
                            <SelectItem value="Other">{t.selectValues.genders.Other}</SelectItem>
                            <SelectItem value="Prefer not to say">{t.selectValues.genders["Prefer not to say"]}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="occupation" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.occupationLabel}</FormLabel>
                        <FormControl><Input placeholder={t.occupationPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="householdSize" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.householdSizeLabel}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormDescription>{t.householdSizeDescription}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              {(selectedRole === 'farmer' || selectedRole === 'consumer') && step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel>{t.sectionName(selectedRole, step)}</FormLabel>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={detectLocation} 
                      disabled={isDetectingLocation}
                      className="text-xs font-bold"
                    >
                      {isDetectingLocation ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <MapPin className="mr-2 h-3 w-3" />}
                      {isDetectingLocation ? t.detecting : t.detectLocation}
                    </Button>
                  </div>
                  
                  {selectedRole === 'consumer' && (
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.residentialAddressLabel}</FormLabel>
                        <FormControl><Textarea placeholder={t.residentialAddressPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="village" render={({ field }) => (
                      <FormItem><FormLabel>{t.villageLabel}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="taluka" render={({ field }) => (
                      <FormItem><FormLabel>{t.talukaLabel}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="district" render={({ field }) => (
                      <FormItem><FormLabel>{t.districtLabel}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="state" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.stateLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="max-h-[300px]">
                            {INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="pincode" render={({ field }) => (
                    <FormItem><FormLabel>{t.pincodeLabel}</FormLabel><FormControl><Input maxLength={6} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              )}

              {selectedRole === 'farmer' && step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <FormField control={form.control} name="accountHolder" render={({ field }) => (
                    <FormItem><FormLabel>{t.bankHolderLabel}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="bankName" render={({ field }) => (
                    <FormItem><FormLabel>{t.bankNameLabel}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="ifsc" render={({ field }) => (
                      <FormItem><FormLabel>{t.ifscLabel}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="accountNumber" render={({ field }) => (
                      <FormItem><FormLabel>{t.accountNumberLabel}</FormLabel><FormControl><Input type="password" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                </div>
              )}

              {selectedRole === 'consumer' && step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <FormItem>
                    <FormLabel>{t.productCategoriesLabel}</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                       {productCategories.map((category) => (
                        <FormField
                          key={category.id}
                          control={form.control}
                          name="productCategories"
                          render={({ field }) => {
                            return (
                              <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, category.id])
                                        : field.onChange(field.value?.filter((value) => value !== category.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{category.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="purchaseFrequency" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.purchaseFrequencyLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Daily">{t.selectValues.purchaseFrequencies.Daily}</SelectItem>
                            <SelectItem value="Weekly">{t.selectValues.purchaseFrequencies.Weekly}</SelectItem>
                            <SelectItem value="Monthly">{t.selectValues.purchaseFrequencies.Monthly}</SelectItem>
                            <SelectItem value="Occasionally">{t.selectValues.purchaseFrequencies.Occasionally}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="purchaseMode" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.purchaseModeLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Direct from Farmers">{t.selectValues.purchaseModes["Direct from Farmers"]}</SelectItem>
                            <SelectItem value="Dealers / Shops">{t.selectValues.purchaseModes["Dealers / Shops"]}</SelectItem>
                            <SelectItem value="Online Delivery">{t.selectValues.purchaseModes["Online Delivery"]}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>
                   <FormField
                    control={form.control}
                    name="organicPreference"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t.organicPreferenceLabel}</FormLabel>
                          <FormDescription>{t.organicPreferenceDescription}</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {(selectedRole === 'farmer' || selectedRole === 'consumer') && step === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                   {selectedRole === 'consumer' && (
                     <div className="space-y-6">
                        <FormItem>
                          <FormLabel>{t.paymentMethodsLabel}</FormLabel>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                             {paymentMethods.map((method) => (
                              <FormField
                                key={method.id}
                                control={form.control}
                                name="paymentMethods"
                                render={({ field }) => (
                                    <FormItem key={method.id} className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(method.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, method.id])
                                              : field.onChange(field.value?.filter((value) => value !== method.id))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{method.label}</FormLabel>
                                    </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </FormItem>
                        <FormField control={form.control} name="upiId" render={({ field }) => (
                          <FormItem><FormLabel>{t.upiIdLabel}</FormLabel><FormControl><Input placeholder={t.upiIdPlaceholder} {...field} /></FormControl></FormItem>
                        )} />
                     </div>
                   )}
                   <FormField control={form.control} name="preferredLanguage" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.preferredLanguageLabel}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="English">{t.selectValues.languages.English}</SelectItem>
                          <SelectItem value="Hindi">{t.selectValues.languages.Hindi}</SelectItem>
                          <SelectItem value="Marathi">{t.selectValues.languages.Marathi}</SelectItem>
                          <SelectItem value="Other">{t.selectValues.languages.Other}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <div className="p-4 border border-dashed rounded-lg bg-muted/50 flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                    <p className="text-sm font-medium">{t.readyToJoin}</p>
                    <p className="text-xs text-muted-foreground text-center">{t.profileCreatedMessage}</p>
                  </div>
                </div>
              )}

              {(selectedRole !== 'farmer' && selectedRole !== 'consumer') && (
                <div className="space-y-6">
                  {(selectedRole === 'exporter' || selectedRole === 'supplier') && (
                    <div className="space-y-6">
                       <FormField control={form.control} name="shopName" render={({ field }) => (
                        <FormItem><FormLabel>Shop Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="shopAddress" render={({ field }) => (
                        <FormItem><FormLabel>Shop Address *</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="gstNumber" render={({ field }) => (
                        <FormItem><FormLabel>GST Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  )}
                  {selectedRole === 'service_provider' && (
                    <FormField control={form.control} name="serviceDetails" render={({ field }) => (
                      <FormItem><FormLabel>Service Details</FormLabel><FormControl><Textarea placeholder="Describe the services you offer..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  )}
                </div>
              )}

              <div className="flex justify-between gap-4 pt-4">
                {steps > 1 && step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t.previousButton}
                  </Button>
                )}
                {steps > 1 && step < steps ? (
                  <Button type="button" onClick={nextStep} className="flex-1">
                    {t.nextButton} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        {steps > 1 ? t.finishRegistrationButton : t.createAccountButton(selectedRole)}
                        <ShieldCheck className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    }>
      <RegistrationForm />
    </Suspense>
  );
}
