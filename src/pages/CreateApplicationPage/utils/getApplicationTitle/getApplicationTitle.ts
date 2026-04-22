export const getApplicationTitle = (jobTitle: string, company: string) =>
  [jobTitle.trim(), company.trim()].filter(Boolean).join(', ');
