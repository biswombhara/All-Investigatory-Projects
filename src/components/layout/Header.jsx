
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useContext } from 'react';
import { Button } from '../ui/button.jsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '../ui/sheet.jsx';
import { Menu, LogOut, LogIn, Edit, Shield, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { signOutUser } from '../../services/auth.js';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.jsx';
import { LoadingContext } from '../../context/LoadingContext.jsx';
import { usePathname } from 'next/navigation.js';
import { useTheme } from 'next-themes';


const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;


const NavLink = ({ href, children, onClick }) => {
  const { showLoader } = useContext(LoadingContext);
  const pathname = usePathname();

  const handleClick = (e) => {
    if (pathname !== href) {
      showLoader();
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
};


const navLinks = [
  { href: '/pdfs', label: 'PDFs' },
  { href: '/reviews', label: 'Reviews' },
];

export function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { user, signIn } = useContext(AuthContext);
  const { showLoader, hideLoader } = useContext(LoadingContext);
  const { setTheme, theme } = useTheme();

  const handleLogin = async () => {
    showLoader();
    try {
      await signIn();
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Login failed:', error);
      }
    } finally {
      hideLoader();
    }
  };

  const handleLogout = async () => {
    showLoader();
    try {
      await signOutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      hideLoader();
    }
  };
  
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };

  const isAdmin = user && user.email === ADMIN_EMAIL;


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <NavLink href="/">
          <div className="flex items-center gap-2">
            <Image src="https://yt3.googleusercontent.com/4bUuIDk_BIXQEWPFuYoXGKd94hhTXLW6jrJDynplZD8vNIlPuvo6TiibXVJcsAAKdKQZsOMRtw=s160-c-k-c0x00ffffff-no-rj" alt="All Investigatory Projects Logo" width={40} height={40} className="rounded-full" />
            <span className="font-headline text-xl font-bold">All Investigatory Projects</span>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
            >
              <span className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary">
                {link.label}
              </span>
            </NavLink>
          ))}
           {isAdmin && (
             <NavLink href="/admin">
                <span className="flex items-center gap-1 text-lg font-medium text-destructive transition-colors hover:text-primary">
                  <Shield size={20} /> Admin
                </span>
             </NavLink>
           )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
           <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {user ? (
            <>
              <Button onClick={handleLogout} variant="outline">
                Logout
                <LogOut className="ml-2 h-4 w-4" />
              </Button>
               <Avatar>
                <AvatarImage src={user.photoURL} alt={user.displayName} />
                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
            </>
          ) : (
            <Button onClick={handleLogin}>
              Login with Google
              <LogIn className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
              <SheetHeader>
                 <NavLink href="/" onClick={() => setMenuOpen(false)}>
                  <SheetTitle className="flex items-center gap-2 border-b pb-6">
                    <Image src="https://yt3.googleusercontent.com/4bUuIDk_BIXQEWPFuYoXGKd94hhTXLW6jrJDynplZD8vNIlPuvo6TiibXVJcsAAKdKQZsOMRtw=s160-c-k-c0x00ffffff-no-rj" alt="All Investigatory Projects Logo" width={40} height={40} className="rounded-full" />
                    <span className="font-headline text-2xl font-bold">All Investigatory Projects</span>
                  </SheetTitle>
                 </NavLink>
                <SheetDescription className="sr-only">A list of navigation links and user authentication options.</SheetDescription>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="text-xl font-medium text-muted-foreground transition-colors hover:text-primary">
                      {link.label}
                    </span>
                  </NavLink>
                ))}
                {isAdmin && (
                  <NavLink href="/admin" onClick={() => setMenuOpen(false)}>
                      <span className="flex items-center gap-1 text-xl font-medium text-destructive transition-colors hover:text-primary">
                        <Shield size={20} /> Admin
                      </span>
                  </NavLink>
                )}
              </nav>
              <div className="mt-auto flex flex-col gap-4 border-t pt-6">
                 <div className="flex justify-center">
                    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                      <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </div>
                 {user ? (
                   <>
                      <div className="flex items-center gap-2">
                         <Avatar>
                          <AvatarImage src={user.photoURL} alt={user.displayName} />
                          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.displayName}</span>
                      </div>
                      <Button onClick={() => { handleLogout(); setMenuOpen(false); }} variant="outline" className="w-full justify-center">
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => { handleLogin(); setMenuOpen(false); }} className="w-full justify-center">
                      <LogIn className="mr-2 h-5 w-5" />
                      Login with Google
                    </Button>
                  )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
