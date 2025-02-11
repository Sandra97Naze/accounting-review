interface AppState {
  user: {
    email: string;
    role: string;
    permissions: {
      canValidate: boolean;
      canEdit: boolean;
      canComment: boolean;
      canExport: boolean;
      canAssignTasks: boolean;
    }
  } | null;
  selectedCompany: {
    id: string;
    name: string;
    siren: string;
    status: string;
  } | null;
  accountingData: {
    currentYear: Record<string, unknown> | null;
    previousYear: Record<string, unknown> | null;
  };
  setUser: (user: AppState['user']) => void;
  setSelectedCompany: (company: AppState['selectedCompany']) => void;
  setAccountingData: (data: Partial<AppState['accountingData']>) => void;
  logout: () => void;
}
