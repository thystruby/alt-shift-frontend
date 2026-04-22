import { describe, expect, it } from 'vitest';

import { parseKeySkills } from './parseKeySkills';

describe('parseKeySkills', () => {
  it('returns trimmed comma-separated skills', () => {
    expect(parseKeySkills('React, TypeScript, UX writing')).toEqual([
      'React',
      'TypeScript',
      'UX writing',
    ]);
  });

  it('removes empty values', () => {
    expect(parseKeySkills('React, , TypeScript,')).toEqual([
      'React',
      'TypeScript',
    ]);
  });
});
