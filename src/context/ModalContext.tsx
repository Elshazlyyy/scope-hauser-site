'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import RegisterModal from '@/components/RegisterModal';

type ModalContextType = {
  openRegister: () => void;
  closeRegister: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [registerOpen, setRegisterOpen] = useState(false);

  // 🚀 Auto-open once on mount
  useEffect(() => {
    setRegisterOpen(true);
  }, []);

  const value = {
    openRegister: () => setRegisterOpen(true),
    closeRegister: () => setRegisterOpen(false),
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used inside ModalProvider');
  return ctx;
}
