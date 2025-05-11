'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export function AnimTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [transitionStage, setTransitionStage] = useState('enter');
    const [currentChildren, setCurrentChildren] = useState(children);
    const previousPathname = useRef(pathname);

    useEffect(() => {
        if (previousPathname.current !== pathname) {
            setTransitionStage('exit');
            previousPathname.current = pathname;
        }
    }, [pathname, children]);

    useEffect(() => {
        if (transitionStage === 'exit') {
            const timer = setTimeout(() => {
                setCurrentChildren(children);
                setTransitionStage('enter');
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [transitionStage, children]);

    return (
        <div className={cn(
            "flex justify-center items-center backdrop-blur-sm bg-white/20 dark:bg-black/30 m-6 rounded-lg border dark:border-white/5 border-white/10 shadow-lg",
            transitionStage === 'enter' ? 'animate-slide-in' : 'animate-slide-out'
        )}>
            {currentChildren}
        </div>
    );
}