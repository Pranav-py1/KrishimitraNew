
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Menu,
  User,
  LogOut,
  ShoppingBasket,
  FlaskConical,
  History,
  LayoutGrid,
  Store,
  ShieldCheck,
  Wheat,
  Languages,
  BookOpen,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ModeToggle } from './theme-toggle';
import { useLanguage } from './language-provider';

const translations = {
  en: {
    products: 'Products',
    market: 'Market',
    soilTesting: 'Soil',
    guide: 'Guide',
    bookings: 'History',
    joinUs: 'Register',
    login: 'Login',
    register: 'Sign Up',
    adminDashboard: 'Admin Panel',
    businessDashboard: 'Business Panel',
    farmerDashboard: 'Farmer Panel',
    consumerDashboard: 'Customer Panel',
    myBookings: 'My Activity',
    logout: 'Log out',
    navMenuTitle: 'Navigation Menu',
    navMenuDesc: 'Access KrishiMitra services and agricultural tools.',
    roles: {
      farmer: 'Farmer',
      exporter: 'Exporter',
      consumer: 'Consumer',
      supplier: 'Supplier',
      service_provider: 'Expert',
      admin: 'Admin',
      none: 'Community Member'
    }
  },
  mr: {
    products: 'उत्पादने',
    market: 'बाजार',
    soilTesting: 'माती',
    guide: 'मार्गदर्शक',
    bookings: 'इतिहास',
    joinUs: 'नोंदणी',
    login: 'लॉगिन',
    register: 'साइन अप',
    adminDashboard: 'अ‍ॅडमिन',
    businessDashboard: 'व्यवसाय',
    farmerDashboard: 'शेतकरी',
    consumerDashboard: 'ग्राहक पॅनेल',
    myBookings: 'माझी कृती',
    logout: 'लॉग आउट',
    navMenuTitle: 'नेव्हिगेशन मेनू',
    navMenuDesc: 'कृषिमित्र सेवा आणि कृषी साधनांमध्ये प्रवेश करा.',
    roles: {
      farmer: 'शेतकरी',
      exporter: 'निर्यातदार',
      consumer: 'ग्राहक',
      supplier: 'पुरवठादार',
      service_provider: 'तज्ज्ञ',
      admin: 'अ‍ॅडमिन',
      none: 'समुदाय सदस्य'
    }
  }
};

const userAvatarImage = PlaceHolderImages.find(p => p.id === 'user-avatar');

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, userData, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const userRole = userData?.role;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Logout Failed', description: 'An error occurred during logout.' });
    }
  };

  const mainNavLinks = [
    { href: '/products', label: t.products, icon: <ShoppingBasket className="h-6 w-6" /> },
    { href: '/market', label: t.market, icon: <Wheat className="h-6 w-6" /> },
    { href: '/guide', label: t.guide, icon: <BookOpen className="h-6 w-6" /> },
    { href: '/soil-testing', label: t.soilTesting, icon: <FlaskConical className="h-6 w-6" /> },
    { href: '/bookings', label: t.bookings, icon: <History className="h-6 w-6" /> },
  ];

  const navLinks = mainNavLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className={cn(
        'group flex flex-col items-center justify-center gap-1.5 transition-all duration-300 py-2 px-3 rounded-2xl min-w-[72px] text-center',
        pathname === link.href ? 'text-primary bg-primary/10 shadow-sm' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
      )}
    >
      <div className={cn("transition-transform duration-300 group-hover:scale-110", pathname === link.href && "scale-110")}>
        {link.icon}
      </div>
      <span className={cn("text-[11px] font-bold tracking-tight uppercase leading-none", pathname === link.href ? "opacity-100" : "opacity-80")}>
        {link.label}
      </span>
    </Link>
  ));

  if (!mounted || isUserLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur shadow-sm">
        <div className="container flex h-24 items-center">
          <Logo />
          <div className="flex-1" />
        </div>
      </header>
    );
  }

  // Helper to get role display name
  const getRoleDisplayName = (role: string | undefined) => {
    if (!role) return t.roles.none;
    const normalizedRole = role.toLowerCase() as keyof typeof t.roles;
    return t.roles[normalizedRole] || t.roles.none;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur shadow-sm transition-all duration-300">
      <div className="container flex h-24 items-center">
        <div className="mr-8 hidden lg:flex shrink-0">
          <Logo className="h-20 w-20" />
        </div>

        <div className="flex w-full items-center justify-between lg:w-auto lg:justify-start">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 lg:hidden h-12 w-12" aria-label="Toggle navigation menu">
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] border-r-0 rounded-r-3xl">
              <SheetHeader>
                <SheetTitle>{t.navMenuTitle}</SheetTitle>
                <SheetDescription>{t.navMenuDesc}</SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <Logo className="mb-10" />
                <nav className="flex flex-col gap-4">{navLinks}</nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 lg:hidden">
            <Logo className="h-16 w-16 mx-auto" />
          </div>

          <nav className="hidden items-center gap-1 lg:flex lg:flex-1 lg:ml-4">
            {navLinks}
          </nav>

          <div className="flex items-center justify-end gap-4 shrink-0 ml-6">
            <div className="hidden sm:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/5">
                    <Languages className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl shadow-soft-xl border-none">
                  <DropdownMenuItem onClick={() => setLanguage('en')} className={cn("rounded-xl transition-all", language === 'en' && "bg-primary/10 text-primary font-bold")}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('mr')} className={cn("rounded-xl transition-all", language === 'mr' && "bg-primary/10 text-primary font-bold")}>
                    मराठी
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
            </div>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full border-2 border-primary/20 p-0 overflow-hidden hover:border-primary transition-all hover:scale-105 active:scale-95 shadow-soft">
                    <Avatar className="h-full w-full">
                       {user.photoURL ? (
                          <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                       ) : userAvatarImage && (
                          <AvatarImage src={userAvatarImage.imageUrl} alt="User" />
                       )}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {userData?.name ? userData.name.charAt(0).toUpperCase() : <User className="h-6 w-6"/>}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2 rounded-2xl shadow-soft-xl border-none" align="end" forceMount>
                  <DropdownMenuLabel className="p-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-base font-bold leading-none">{userData?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize font-medium">
                        {getRoleDisplayName(userRole)}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="mx-2" />
                  <div className="p-1 space-y-1">
                    {userRole === 'admin' && (
                       <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                        <Link href="/dashboard/admin" className="flex items-center">
                          <ShieldCheck className="mr-3 h-5 w-5 text-primary" />
                          <span className="font-bold">{t.adminDashboard}</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {['exporter', 'supplier'].includes(userRole?.toLowerCase()) && (
                       <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                        <Link href={`/dashboard/${userRole.toLowerCase()}`} className="flex items-center">
                          <Store className="mr-3 h-5 w-5 text-primary" />
                          <span className="font-bold">{t.businessDashboard}</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {userRole?.toLowerCase() === 'farmer' && (
                       <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                        <Link href="/dashboard/farmer" className="flex items-center">
                          <LayoutGrid className="mr-3 h-5 w-5 text-primary" />
                          <span className="font-bold">{t.farmerDashboard}</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {userRole?.toLowerCase() === 'consumer' && (
                       <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                        <Link href="/dashboard/consumer" className="flex items-center">
                          <LayoutGrid className="mr-3 h-5 w-5 text-primary" />
                          <span className="font-bold">{t.consumerDashboard}</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                      <Link href="/bookings" className="flex items-center">
                        <History className="mr-3 h-5 w-5 text-primary" />
                        <span className="font-bold">{t.myBookings}</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator className="mx-2" />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl p-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                     <LogOut className="mr-3 h-5 w-5" />
                     <span className="font-bold">{t.logout}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
               <div className="flex items-center gap-3">
                 <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-primary font-bold h-10 px-5 rounded-full hover:bg-primary/5">
                    <Link href="/login">{t.login}</Link>
                  </Button>
                  <Button size="sm" asChild className="h-10 px-6 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    <Link href="/register">{t.register}</Link>
                  </Button>
               </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
