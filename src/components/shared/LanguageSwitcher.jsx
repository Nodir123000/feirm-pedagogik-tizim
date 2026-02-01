import React from 'react';
import { useLanguage, languageOptions } from './LanguageContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ variant = "default" }) {
    const { language, setLanguage } = useLanguage();

    const currentLang = languageOptions.find(l => l.code === language);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant === "ghost" ? "ghost" : "outline"}
                    size="sm"
                    className="gap-2 min-w-[140px] justify-start"
                >
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentLang?.name || 'Language'}</span>
                    <span className="sm:hidden">{currentLang?.flag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {languageOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.code}
                        onClick={() => setLanguage(option.code)}
                        className={`gap-3 cursor-pointer ${language === option.code ? 'bg-slate-100' : ''}`}
                    >
                        <span className="text-lg">{option.flag}</span>
                        <span>{option.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}