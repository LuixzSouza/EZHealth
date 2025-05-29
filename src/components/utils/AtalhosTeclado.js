'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AtalhosTeclado({ setIsOpenSearch, setIsOpenMenu }) {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; // evita conflitos com inputs
        
        switch (e.key.toLowerCase()) {
            case 'p':
                setIsOpenSearch(true);
            break;
            case 'm':
                setIsOpenMenu(true);
            break;
            case 'l':
                router.push('/login-medico');
            break;
            default:
            break;
        }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setIsOpenSearch, setIsOpenMenu, router]);

    return null; // Componente invisível
}