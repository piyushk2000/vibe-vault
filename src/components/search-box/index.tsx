import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { COLORS } from '../../theme/colors'; // Import COLORS
import { useDispatch } from 'react-redux';
import { setSearch } from '../../redux/searchSlice';
import { useState } from 'react';

export default function MediaSeachBox() {

  // const searchText = useSelector((state: any) => state.searchText.value)
  const dispatch = useDispatch()
  const [localSearchText, setLocalSearchText] = useState('')

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      dispatch(setSearch(localSearchText));
    }
  };

  return (
    <Paper
      component="form"
      sx={{ 
        p: '2px 4px', 
        display: 'flex', 
        alignItems: 'center', 
        width: 400,
        maxWidth: '100%',
        backgroundColor: COLORS.SEARCH_BOX_BACKGROUND,
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: `1px solid ${COLORS.GLASS_BORDER}`,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: COLORS.GLASS_BORDER_STRONG,
          boxShadow: '0 6px 20px rgba(99, 102, 241, 0.15)',
        },
        '&:focus-within': {
          borderColor: COLORS.ACCENT,
          boxShadow: `0 0 0 3px ${COLORS.ACCENT_BACKGROUND}`,
        },
      }}
      onKeyDown={handleKeyDown}
    >
      <InputBase
        sx={{ 
          ml: 1, 
          flex: 1, 
          color: COLORS.SEARCH_BOX_TEXT // Use text color
        }}
        onChange={(e) => (setLocalSearchText(e.target.value))} 
        placeholder="Search For Media"
        inputProps={{ 'aria-label': 'Search for media ' }} // to add selected media type
      />
      <IconButton type="button" onClick={()=>dispatch(setSearch(localSearchText))} sx={{ p: '10px', color: COLORS.SEARCH_BOX_TEXT }} aria-label="search">
        <SearchIcon />
      </IconButton>

    </Paper>
  );
}
