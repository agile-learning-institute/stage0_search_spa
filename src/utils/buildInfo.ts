// Build information
export const getSpaBuiltAt = (): string => {
  return (globalThis as any).__SPA_BUILT_AT__ || new Date().toISOString()
} 