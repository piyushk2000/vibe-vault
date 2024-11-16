import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { COLORS } from '../../theme/colors'; // Import COLORS

export default function MediaSeachBox() {
  return (
    <Paper
      component="form"
      sx={{ 
        p: '2px 4px', 
        display: 'flex', 
        alignItems: 'center', 
        width: 400, 
        backgroundColor: COLORS.SEARCH_BOX_BACKGROUND // Use background color
      }}
    >
      <InputBase
        sx={{ 
          ml: 1, 
          flex: 1, 
          color: COLORS.SEARCH_BOX_TEXT // Use text color
        }}
        placeholder="Search For Media"
        inputProps={{ 'aria-label': 'Search for media ' }} // to add selected media type
      />
      <IconButton type="button" sx={{ p: '10px', color: COLORS.SEARCH_BOX_TEXT }} aria-label="search">
        <SearchIcon />
      </IconButton>

    </Paper>
  );
}
