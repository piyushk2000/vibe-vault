import { createTheme } from '@mui/material/styles';
import { COLORS } from './colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.ACCENT,
      contrastText: COLORS.TEXT_PRIMARY,
    },
    secondary: {
      main: COLORS.SECONDARY,
      contrastText: COLORS.TEXT_PRIMARY,
    },
    background: {
      default: COLORS.PRIMARY,
      paper: COLORS.SECONDARY,
    },
    text: {
      primary: COLORS.TEXT_PRIMARY,
      secondary: COLORS.TEXT_SECONDARY,
    },
    divider: COLORS.DIVIDER,
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: COLORS.DIALOG_BACKGROUND,
          color: COLORS.DIALOG_TEXT,
        },
      },
    },
    // ...existing code...
  },
});

export default theme;