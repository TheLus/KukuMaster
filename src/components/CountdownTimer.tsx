import { Theme } from '@emotion/react';
import { SxProps, Typography } from '@mui/material'

type CountDownTimerProps = {
  count: number;
  sx?: SxProps<Theme>;
}

export const CountdownTimer = ({ count, sx }: CountDownTimerProps) => {
  return <Typography sx={sx} variant='h1'>{count}</Typography>
}
