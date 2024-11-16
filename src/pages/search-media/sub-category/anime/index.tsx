import { Box } from "@mui/material"
import MediaCard from "../../../../components/cards"

const AnimeList = () => {
  return (
    <>
    
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
       <MediaCard /> 
    </Box>
    </>
  )
}

export default AnimeList