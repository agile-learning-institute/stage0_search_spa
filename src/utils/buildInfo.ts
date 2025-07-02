// Build information
export const getSpaBuiltAt = (): string => {
  return (import.meta as any).env?.VITE_BUILD_TIME || new Date().toISOString()
} 