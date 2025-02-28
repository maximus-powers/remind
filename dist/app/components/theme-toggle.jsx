'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/app/components/ui/button';
export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    useEffect(() => {
        setMounted(true);
        if (!theme) {
            setTheme('dark');
        }
    }, [theme, setTheme]);
    if (!mounted) {
        return null;
    }
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    return (<Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === 'light' ? (<Sun className="h-[1.2rem] w-[1.2rem]"/>) : (<Moon className="h-[1.2rem] w-[1.2rem]"/>)}
      <span className="sr-only">Toggle theme</span>
    </Button>);
}
