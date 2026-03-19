/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#16A34A';
const tintColorDark = '#16A34A';

const lightGreenBackground = '#E9FCE9';
const lightGreenSurface = '#F7FFF7';
const lightGreenSurfaceAlt = '#DCFCE7';
const lightGreenBorder = '#BFE7BF';
const lightGreenText = '#052E16';
const lightGreenMutedText = '#2F6B3B';
const lightGreenStrongBg = '#166534';
const lightGreenStrongText = '#F0FDF4';

export const Colors = {
  light: {
    text: lightGreenText,
    background: lightGreenBackground,
    surface: lightGreenSurface,
    surfaceAlt: lightGreenSurfaceAlt,
    border: lightGreenBorder,
    mutedText: lightGreenMutedText,
    strongBg: lightGreenStrongBg,
    strongText: lightGreenStrongText,
    tint: tintColorLight,
    icon: lightGreenMutedText,
    tabIconDefault: lightGreenMutedText,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: lightGreenText,
    background: lightGreenBackground,
    surface: lightGreenSurface,
    surfaceAlt: lightGreenSurfaceAlt,
    border: lightGreenBorder,
    mutedText: lightGreenMutedText,
    strongBg: lightGreenStrongBg,
    strongText: lightGreenStrongText,
    tint: tintColorDark,
    icon: lightGreenMutedText,
    tabIconDefault: lightGreenMutedText,
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
