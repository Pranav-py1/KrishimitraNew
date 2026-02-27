'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Menu,
  ShoppingBasket,
  FlaskConical,
  History,
  LayoutGrid,
  ShieldCheck,
  Wheat,
  Languages,
  BookOpen,
  ArrowLeftRight,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Logo } from '@/components/logo';
import { ModeToggle } from './theme-toggle';
import { useLanguage } from './language-provider';
import { useRole } from './role-context';
import { Badge } from './ui/badge';

const translations = {
  en: {
    products: 'Products',
    market: 'Market',
    soilTesting: 'Soil',
    guide: 'Guide',
    bookings: 'History',
    switchRole: 'Switch Role',
    dashboard: 'Dashboard',
    navMenuTitle: 'Navigation Menu',
    navMenuDesc: 'Access KrishiMitra services and agricultural tools.',
    roles: {
      farmer: 'Farmer',
      exporter: 'Exporter',
      supplier: 'Supplier',
      admin: 'Admin',
    }
  },
  mr: {
    products: 'उत्पादने',
    market: 'बाजार',
    soilTesting: 'माती',
    guide: 'मार्गदर्शक',
    bookings: 'इतिहास',
    switchRole: 'भूमिका बदला',
    dashboard: 'डॅशबोर्ड',
    navMenuTitle: 'नेव्हिगेशन मेनू',
    navMenuDesc: 'कृषिमित्र सेवा आणि कृषी साधनांमध्ये प्रवेश करा.',
    roles: {
      farmer: 'शेतकरी',
      exporter: 'निर्यातदार',
      supplier: 'पुरवठादार',
      admin: 'अ‍ॅडमिन',
    }
  }
};

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { role, clearRole } = useRole();
  const t = translations[language];

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur shadow-sm">
        <div className="container flex h-24 items-center">
          <Logo />
          <div className="flex-1" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur shadow-sm transition-all duration-300">
      <div className="container flex h-24 items-center">
        <div className="mr-8 hidden lg:flex shrink-0">
          <Logo className="h-20 w-20" />
        </div>

        <div className="flex w-full items-center justify-between lg:w-auto lg:justify-start">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 lg:hidden h-12 w-12">
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
            {role && (
              <div className="hidden md:flex items-center gap-2 mr-2">
                <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-none font-bold uppercase tracking-wider text-[10px]">
                  {t.roles[role as keyof typeof t.roles]}
                </Badge>
                <Button variant="ghost" size="sm" onClick={clearRole} className="h-8 text-xs font-bold gap-2">
                  <ArrowLeftRight className="h-3 w-3" />
                  {t.switchRole}
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2">
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
            
            {role && (
              <Button asChild size="sm" className="h-10 px-6 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                <Link href={`/dashboard/${role.replace('_', '-')}`}>
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  {t.dashboard}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
