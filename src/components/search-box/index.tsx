import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { COLORS } from '../../theme/colors'; // Import COLORS
import { useDispatch, useSelector } from 'react-redux';
import { setSearch } from '../../redux/searchSlice';
import { useState } from 'react';

export default function MediaSeachBox() {

  const searchText = useSelector((state: any) => state.searchText.value)
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
        backgroundColor: COLORS.SEARCH_BOX_BACKGROUND // Use background color
      }}
      onKeyDown={handleKeyDown} // Add onKeyDown event
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
