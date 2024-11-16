import { Box, Typography } from '@mui/material'

const MediaCard = () => {
  return ( 
    <>
    <Box width={120} height={180}>
    <Box>
      <img src="https://via.placeholder.com/1920x1080" alt="My Vibe" width={120} height={180}/>
    </Box>
    <Typography variant="body1" sx={{ hyphens: 'auto', wordBreak: 'break-word' }}>
      full metal alchamist
    </Typography>
    </Box>
    </>
  )
}

export default MediaCard