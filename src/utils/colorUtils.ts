/**
 * Convert hex color to rgba with specified opacity
 * @param hex - Hex color string (e.g., '#4CAF50' or '4CAF50')
 * @param opacity - Opacity value between 0 and 1 (default: 1)
 * @returns rgba color string (e.g., 'rgba(76, 175, 80, 0.7)')
 */
export function hexToRgba(hex: string, opacity: number = 1): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Parse hex values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get brand primary color with fallback
 * @param brandColor - Brand primary color from API
 * @param fallback - Fallback color (default: '#4CAF50')
 * @returns Color string
 */
export function getBrandColor(brandColor?: string, fallback: string = '#4CAF50'): string {
  return brandColor || fallback;
}

/**
 * Get brand overlay color with transparency
 * @param brandColor - Brand primary color from API
 * @param opacity - Opacity value (default: 0.7)
 * @param fallback - Fallback color (default: '#4CAF50')
 * @returns rgba color string
 */
export function getBrandOverlayColor(
  brandColor?: string,
  opacity: number = 0.7,
  fallback: string = '#4CAF50'
): string {
  const color = getBrandColor(brandColor, fallback);
  return hexToRgba(color, opacity);
}
