'use client';

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';

interface StepImageFrameProps {
  src: string;
  hint: string;
  alt: string;
  accent: string;
}

/**
 * Shows the real screenshot once it exists at `src`. Until then (or if the
 * file 404s), falls back to a labeled placeholder frame so it's obvious
 * which print goes where — no code change needed once the file is added.
 */
export function StepImageFrame({ src, hint, alt, accent }: StepImageFrameProps) {
  const [failed, setFailed] = useState(false);

  // Reset the "failed" state whenever the step (and therefore the src) changes.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '18px',
        overflow: 'hidden',
        backgroundColor: '#FAFBFC',
        border: '1px solid #E5E9F0',
        boxShadow: '0 8px 24px rgba(13,30,59,0.08)',
      }}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      )}

      {failed && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: { xs: 0.75, sm: 1.25 },
            px: { xs: 2, sm: 3 },
            border: `2px dashed ${accent}55`,
            borderRadius: '18px',
            m: '2px',
          }}
        >
          <Box
            sx={{
              width: { xs: 40, sm: 52 },
              height: { xs: 40, sm: 52 },
              borderRadius: '50%',
              backgroundColor: `${accent}1A`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageRoundedIcon sx={{ fontSize: { xs: 20, sm: 26 }, color: accent }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.75rem', sm: '0.85rem' }, color: '#13284D' }}>
            {hint}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: { xs: '0.62rem', sm: '0.72rem' },
              color: '#8A93A3',
              backgroundColor: '#fff',
              border: '1px solid #E5E9F0',
              borderRadius: '999px',
              px: 1.5,
              py: 0.4,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {src}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
