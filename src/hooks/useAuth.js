// ✅ PASSO 1: CRIE ESTE NOVO ARQUIVO EM:
// src/hooks/useAuth.js (crie a pasta 'hooks' se ela não existir)

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth(userType = 'medico') {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Determina qual item buscar no localStorage
    const storageKey = userType === 'admin' ? 'adminLogado' : 'medicoLogado';
    const redirectUrl = userType === 'admin' ? '/login-admin' : '/login-medico';

    const loggedInData = localStorage.getItem(storageKey);

    if (!loggedInData) {
      router.push(redirectUrl);
    } else {
      setUser(JSON.parse(loggedInData));
      setLoading(false);
    }
  }, [router, userType]);

  const logout = () => {
    const storageKey = userType === 'admin' ? 'adminLogado' : 'medicoLogado';
    const redirectUrl = userType === 'admin' ? '/login-admin' : '/login-medico';

    localStorage.removeItem(storageKey);
    router.push(redirectUrl);
  };

  return { user, loading, logout };
}
