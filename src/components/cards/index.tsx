import { Box, Typography } from '@mui/material'

interface MediaCardProps {
  imageUrl?: string
  showName?: string
}

const MediaCard: React.FC<MediaCardProps> = ({ imageUrl = '', showName = '' }) => {
  return ( 
    <Box width={120} height={180}>
      <Box>
        {imageUrl ? (
          <img src={imageUrl} alt={showName || 'My Vibe'} width={120} height={180}/>
        ) : (
          <Box width={120} height={180} bgcolor="grey.300" />
        )}
      </Box>
      <Typography variant="body1" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 250 }}>
        { showName || 'Unknown Title'}
      </Typography>
    </Box>
  )
}

export default MediaCard