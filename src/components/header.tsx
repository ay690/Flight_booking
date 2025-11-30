'use client';

import Link from 'next/link';
import { Plane, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
import { cn } from '@/lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      setIsSigningOut(true);
      await dispatch(logout());
      await router.push('/auth');
    } finally {
      setIsSigningOut(false);
    }
  };

  const navLinks = [
    { href: "/bookings", label: "My Bookings" },
    { href: "/flights", label: "Flight Status" },
  ];

  return (
    <header className={cn(
        "fixed top-0 left-0 right-0 z-30 transition-all duration-300",
        isScrolled ? "bg-card shadow-md text-foreground" : "bg-transparent text-white"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Plane className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">SkyRoute</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Button key={link.href} variant="ghost" asChild className={cn(isScrolled ? "text-foreground" : "text-white hover:bg-white/10 hover:text-white")}><Link href={link.href}>{link.label}</Link></Button>
            ))}
            {isAuthenticated && user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-2 p-2">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Button 
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center gap-2 cursor-pointer"
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing out...
                      </>
                    ) : 'Sign Out'}
                  </Button>
                </PopoverContent>
              </Popover>
            ) : (
              <Button variant="ghost" asChild className={cn(isScrolled ? "text-foreground" : "text-white hover:bg-white/10 hover:text-white")}><Link href="/auth">Sign In</Link></Button>
            )}
          </nav>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full bg-card text-foreground">
                <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                 <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                         <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <Plane className="h-8 w-8" />
                            <span className="text-xl font-bold tracking-tight">SkyRoute</span>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                           <X className="h-6 w-6" />
                           <span className="sr-only">Close menu</span>
                        </Button>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <nav className="flex flex-col items-center space-y-6">
                            {navLinks.map(link => (
                                <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium hover:text-primary transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="p-4 border-t">
                        {isAuthenticated ? (
                            <Button 
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center gap-2 cursor-pointer"
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing out...
                      </>
                    ) : 'Sign Out'}
                  </Button>
                        ) : (
                            <Button asChild className="w-full cursor-pointer"><Link href="/auth">Sign In</Link></Button>
                        )}
                    </div>
                 </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
