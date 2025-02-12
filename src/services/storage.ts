export const saveCompany = (company: Company) => {
  const companies = JSON.parse(localStorage.getItem('companies') || '[]');
  companies.push(company);
  localStorage.setItem('companies', JSON.stringify(companies));
};

export const getCompanies = (): Company[] => {
  return JSON.parse(localStorage.getItem('companies') || '[]');
};
