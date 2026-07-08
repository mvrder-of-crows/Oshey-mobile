import { useWindowDimensions } from "react-native";

/** Returns layout hints so screens can adapt to tablets/large screens
 *  without hardcoding breakpoints in every file. */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isLandscape = width > height;

  return {
    width,
    height,
    isTablet,
    isLandscape,
    // Caps content width on tablets instead of letting text stretch edge to edge
    contentMaxWidth: isTablet ? 480 : width,
    columns: isTablet ? 2 : 1,
  };
}
