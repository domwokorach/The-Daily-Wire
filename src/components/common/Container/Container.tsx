import MuiContainer, { type ContainerProps } from '@mui/material/Container';

function Container({ children, sx, maxWidth = 'xl', ...rest }: ContainerProps) {
  return (
    <MuiContainer maxWidth={maxWidth} sx={{ py: { xs: 3, md: 5 }, ...sx }} {...rest}>
      {children}
    </MuiContainer>
  );
}

export default Container;
