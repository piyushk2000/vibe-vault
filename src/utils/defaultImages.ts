// Default SVG images for when media covers are not available

export const getBookNotFoundImage = (): string => {
  const svg = `
    <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="300" height="400" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="2"/>
      
      <!-- Book Icon -->
      <g transform="translate(75, 120)">
        <!-- Book Cover -->
        <rect x="0" y="0" width="150" height="180" fill="#8B4513" rx="8"/>
        <rect x="10" y="10" width="130" height="160" fill="#A0522D" rx="4"/>
        
        <!-- Book Spine -->
        <rect x="0" y="0" width="20" height="180" fill="#654321" rx="8 0 0 8"/>
        
        <!-- Book Pages -->
        <rect x="140" y="5" width="10" height="170" fill="#ffffff" rx="0 4 4 0"/>
        <rect x="135" y="8" width="10" height="164" fill="#f8f8f8" rx="0 2 2 0"/>
        
        <!-- Question Mark -->
        <circle cx="75" cy="70" r="25" fill="#ffffff" opacity="0.9"/>
        <text x="75" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#8B4513">?</text>
      </g>
      
      <!-- Text -->
      <text x="150" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="500" fill="#666666">No Cover Available</text>
      <text x="150" y="365" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#999999">Book Image Not Found</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const getAnimeNotFoundImage = (): string => {
  const svg = `
    <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="300" height="400" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="2"/>
      
      <!-- Anime Icon -->
      <g transform="translate(100, 140)">
        <!-- Screen -->
        <rect x="0" y="0" width="100" height="75" fill="#333333" rx="8"/>
        <rect x="5" y="5" width="90" height="65" fill="#000000" rx="4"/>
        
        <!-- Play Button -->
        <polygon points="35,25 35,45 55,35" fill="#ff6b6b"/>
        
        <!-- Question Mark -->
        <circle cx="50" cy="100" r="20" fill="#ffffff" opacity="0.9"/>
        <text x="50" y="110" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#333333">?</text>
      </g>
      
      <!-- Text -->
      <text x="150" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="500" fill="#666666">No Poster Available</text>
      <text x="150" y="365" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#999999">Anime Image Not Found</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const getMovieNotFoundImage = (): string => {
  const svg = `
    <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="300" height="400" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="2"/>
      
      <!-- Movie Icon -->
      <g transform="translate(100, 140)">
        <!-- Film Reel -->
        <circle cx="50" cy="40" r="35" fill="#333333"/>
        <circle cx="50" cy="40" r="25" fill="#666666"/>
        <circle cx="50" cy="40" r="15" fill="#333333"/>
        
        <!-- Film Strip -->
        <rect x="20" y="85" width="60" height="8" fill="#333333"/>
        <rect x="22" y="87" width="4" height="4" fill="#666666"/>
        <rect x="28" y="87" width="4" height="4" fill="#666666"/>
        <rect x="34" y="87" width="4" height="4" fill="#666666"/>
        <rect x="40" y="87" width="4" height="4" fill="#666666"/>
        <rect x="46" y="87" width="4" height="4" fill="#666666"/>
        <rect x="52" y="87" width="4" height="4" fill="#666666"/>
        <rect x="58" y="87" width="4" height="4" fill="#666666"/>
        <rect x="64" y="87" width="4" height="4" fill="#666666"/>
        <rect x="70" y="87" width="4" height="4" fill="#666666"/>
        
        <!-- Question Mark -->
        <circle cx="50" cy="120" r="20" fill="#ffffff" opacity="0.9"/>
        <text x="50" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#333333">?</text>
      </g>
      
      <!-- Text -->
      <text x="150" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="500" fill="#666666">No Poster Available</text>
      <text x="150" y="365" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#999999">Movie Image Not Found</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const getShowNotFoundImage = (): string => {
  const svg = `
    <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="300" height="400" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="2"/>
      
      <!-- TV Icon -->
      <g transform="translate(75, 120)">
        <!-- TV Screen -->
        <rect x="0" y="0" width="150" height="100" fill="#333333" rx="8"/>
        <rect x="10" y="10" width="130" height="80" fill="#000000" rx="4"/>
        
        <!-- TV Stand -->
        <rect x="60" y="100" width="30" height="20" fill="#666666"/>
        <rect x="40" y="120" width="70" height="8" fill="#666666" rx="4"/>
        
        <!-- Screen Content -->
        <rect x="20" y="20" width="110" height="60" fill="#1a1a1a" rx="2"/>
        
        <!-- Question Mark -->
        <circle cx="75" cy="50" r="20" fill="#ffffff" opacity="0.9"/>
        <text x="75" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#333333">?</text>
      </g>
      
      <!-- Text -->
      <text x="150" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="500" fill="#666666">No Poster Available</text>
      <text x="150" y="365" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#999999">Show Image Not Found</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Generic fallback for any media type
export const getDefaultMediaImage = (type: string): string => {
  switch (type.toUpperCase()) {
    case 'BOOK':
      return getBookNotFoundImage();
    case 'ANIME':
      return getAnimeNotFoundImage();
    case 'MOVIE':
      return getMovieNotFoundImage();
    case 'SHOW':
      return getShowNotFoundImage();
    default:
      return getBookNotFoundImage(); // Default fallback
  }
};