import React from 'react';
import {Text as RNText, TextProps as RNTextProps} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useBrand} from '../../contexts/BrandContext';
import {getMontserratFontFamily} from '../../utils/fonts';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';
  weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}

export function Text({style, variant = 'body', weight, ...props}: TextProps) {
  const {typography} = useTheme();
  const {brand} = useBrand();
  
  const variantStyle = typography[variant] || typography.body;
  const finalWeight = weight || variantStyle.fontWeight || '400';
  const fontFamilyName = getMontserratFontFamily(finalWeight);

  return (
    <RNText
      style={[
        {
          fontFamily: fontFamilyName,
          fontSize: variantStyle.fontSize,
          fontWeight: finalWeight,
          lineHeight: variantStyle.lineHeight,
        },
        style,
      ]}
      {...props}
    />
  );
}
