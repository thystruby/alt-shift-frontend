import type { IGenerateApplicationTextViaAIParams } from '../../types';

export const buildApplicationTextPrompt = ({
  additionalDetails,
  company,
  jobTitle,
  keySkills,
}: IGenerateApplicationTextViaAIParams) => [
  'Write a simple, concise cover letter for a job application.',
  '',
  'Use only the provided details. Do not invent achievements, dates, metrics, or facts.',
  'Return only the cover letter text without markdown, headings, explanations, or placeholders.',
  'Keep the tone professional, natural, and direct.',
  '',
  `Company: ${company}`,
  `Job title: ${jobTitle}`,
  `Key skills: ${keySkills.join(', ')}`,
  `Additional details: ${additionalDetails}`,
].join('\n');
