export type FilterLevel = 'off' | 'default' | 'max';

export const FilterLevel = {
  Off: 'off' as const,
  Default: 'default' as const,
  Max: 'max' as const,
} as const;
