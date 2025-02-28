'use client';
import { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@/app/components/ui/tooltip';
export default function InfoTooltip({ className = '' }) {
    const [isOpen, setIsOpen] = useState(false);
    return (<TooltipProvider>
      <Tooltip open={isOpen}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className={className} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} onClick={() => setIsOpen(!isOpen)}>
            <Info className="h-4 w-4"/>
            <span className="sr-only">Help information</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
          <p className="mb-2">
            This is a simple web app to help you retain info (e.g. quotes,
            phrases, history):
          </p>
          <p>- Add tabs to organize facts (triple click to rename).</p>
          <p>- Add cards to each tab.</p>
          <p>
            - Generate a podcast for reminders (curates the least recently used
            cards).
          </p>
          <p>- Try not to be a know-it-all ;)</p>
          <p className="mt-2">
            <a href="https://github.com/maximus-powers/remind" target="_blank" rel="noopener noreferrer" className="text-blue-500">
              {' '}
              github
            </a>{' '}
            | made with ❤️ by{' '}
            <a href="https://www.linkedin.com/in/maximuspowers/" target="_blank" rel="noopener noreferrer" className="text-blue-500">
              maxie
            </a>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>);
}
