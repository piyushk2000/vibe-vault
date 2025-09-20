import { Box, Typography } from "@mui/material"

const AnimeList = () => {
  return (
    <>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', p: 4 }}>
       <Typography variant="h6" color="textSecondary">
         Anime list coming soon...
       </Typography>
    </Box>
    </>
  )
}

export default AnimeList