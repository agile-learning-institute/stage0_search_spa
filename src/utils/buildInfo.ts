// Build information
export const getSpaBuiltAt = (): string => {
  return import.meta.env.VITE_BUILD_TIME || new Date().toISOString()
} 