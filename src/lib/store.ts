import { create } from 'zustand';

interface AppState {
  user: any | null;
  selectedCompany: any | null;
  accountingData: {
    currentYear: any | null;
    previousYear: any | null;
  };
  setUser: (user: any) => void;
  setSelectedCompany: (company: any) => void;
  setAccountingData: (data: any) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  selectedCompany: null,
  accountingData: {
    currentYear: null,
    previousYear: null
  },
  setUser: (user) => set({ user }),
  setSelectedCompany: (company) => set({ selectedCompany: company }),
  setAccountingData: (data) => set((state) => ({
    accountingData: { ...state.accountingData, ...data }
  })),
  logout: () => set({
    user: null,
    selectedCompany: null,
    accountingData: {
      currentYear: null,
      previousYear: null
    }
  })
}));