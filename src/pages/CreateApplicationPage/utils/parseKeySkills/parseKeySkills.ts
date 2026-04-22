export const parseKeySkills = (value: string): string[] =>
  value
    .split(',')
    .map(skill => skill.trim())
    .filter(Boolean);
