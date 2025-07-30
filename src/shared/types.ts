export type FilterLevel = 'default' | 'max';

export const FilterLevel = {
  Default: 'default' as const,
  Max: 'max' as const,
} as const;
