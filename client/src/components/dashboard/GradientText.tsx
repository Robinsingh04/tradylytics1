import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface GradientTextProps {
  text: string;
  className?: string;
}

const GradientBox = styled(Box)({
  background: 'linear-gradient(90deg, #439DDF 0%, #4F87ED 40%, #9476C5 60%, #BC688E 80%, #C96676 90%, #D6645D 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 500,
  fontSize: '1.25rem',
});

export function GradientText({ text, className }: GradientTextProps) {
  return (
    <GradientBox className={className}>
      {text}
    </GradientBox>
  );
}