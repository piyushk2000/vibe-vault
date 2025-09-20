// TODO: Improve match calculation algorithm based on:
// - Exact media matches (same titles with similar ratings)
// - Genre preferences overlap
// - Rating patterns similarity
// - User activity and preferences
// - Cross-media type preferences (anime fans who also like manga/books)
// - Reading habits and book preferences for book matches

interface Media {
  title: string;
  type: string;
  rating: number;
  genres: string[];
}

interface User {
  interests: string[];
  topMedia: Media[];
}

export const calculateMatchPercentage = (currentUser: User | null, targetUser: User): number => {
  // Base match percentage
  let matchPercentage = 50;

  if (!currentUser) {
    return matchPercentage;
  }

  // Interest overlap calculation (30% weight)
  const interestOverlap = calculateInterestOverlap(currentUser.interests, targetUser.interests);
  matchPercentage += interestOverlap * 0.3;

  // Media overlap calculation (40% weight)
  const mediaOverlap = calculateMediaOverlap(currentUser.topMedia, targetUser.topMedia);
  matchPercentage += mediaOverlap * 0.4;

  // Genre preference overlap (30% weight)
  const genreOverlap = calculateGenreOverlap(currentUser.topMedia, targetUser.topMedia);
  matchPercentage += genreOverlap * 0.3;

  // Ensure percentage is between 0 and 100
  return Math.min(Math.max(Math.round(matchPercentage), 0), 100);
};

const calculateInterestOverlap = (userInterests: string[], targetInterests: string[]): number => {
  if (userInterests.length === 0 || targetInterests.length === 0) {
    return 0;
  }

  const commonInterests = userInterests.filter(interest => 
    targetInterests.some(targetInterest => 
      targetInterest.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(targetInterest.toLowerCase())
    )
  );

  const totalUniqueInterests = new Set([...userInterests, ...targetInterests]).size;
  return (commonInterests.length / totalUniqueInterests) * 100;
};

const calculateMediaOverlap = (userMedia: Media[], targetMedia: Media[]): number => {
  if (userMedia.length === 0 || targetMedia.length === 0) {
    return 0;
  }

  let exactMatches = 0;
  let ratingCompatibility = 0;
  let totalComparisons = 0;

  userMedia.forEach(userItem => {
    targetMedia.forEach(targetItem => {
      totalComparisons++;
      
      // Check for exact title match
      if (userItem.title.toLowerCase() === targetItem.title.toLowerCase()) {
        exactMatches++;
        
        // Calculate rating compatibility for exact matches
        const ratingDiff = Math.abs(userItem.rating - targetItem.rating);
        const ratingScore = Math.max(0, (5 - ratingDiff) / 5) * 100;
        ratingCompatibility += ratingScore;
      }
    });
  });

  if (exactMatches === 0) {
    return 0;
  }

  // Combine exact matches and rating compatibility
  const exactMatchScore = (exactMatches / Math.max(userMedia.length, targetMedia.length)) * 100;
  const avgRatingCompatibility = ratingCompatibility / exactMatches;
  
  return (exactMatchScore + avgRatingCompatibility) / 2;
};

const calculateGenreOverlap = (userMedia: Media[], targetMedia: Media[]): number => {
  if (userMedia.length === 0 || targetMedia.length === 0) {
    return 0;
  }

  // Extract all genres from user's media
  const userGenres = userMedia.flatMap(media => media.genres);
  const targetGenres = targetMedia.flatMap(media => media.genres);

  if (userGenres.length === 0 || targetGenres.length === 0) {
    return 0;
  }

  // Calculate genre overlap
  const commonGenres = userGenres.filter(genre => 
    targetGenres.some(targetGenre => 
      targetGenre.toLowerCase() === genre.toLowerCase()
    )
  );

  const totalUniqueGenres = new Set([
    ...userGenres.map(g => g.toLowerCase()), 
    ...targetGenres.map(g => g.toLowerCase())
  ]).size;

  return (commonGenres.length / totalUniqueGenres) * 100;
};

// Mock function to get current user data (replace with actual user data)
export const getCurrentUserMockData = (): User => {
  // TODO: Replace with actual current user data from Redux store
  return {
    interests: ['Anime', 'Gaming', 'Movies', 'Technology', 'Reading', 'Science Fiction'],
    topMedia: [
      {
        title: 'Attack on Titan',
        type: 'ANIME',
        rating: 5,
        genres: ['Action', 'Drama', 'Fantasy']
      },
      {
        title: 'The Dark Knight',
        type: 'MOVIE',
        rating: 5,
        genres: ['Action', 'Crime', 'Drama']
      },
      {
        title: 'Breaking Bad',
        type: 'SHOW',
        rating: 5,
        genres: ['Crime', 'Drama', 'Thriller']
      },
      {
        title: 'Dune',
        type: 'BOOK',
        rating: 5,
        genres: ['Science Fiction', 'Adventure', 'Politics']
      },
      {
        title: 'The Hobbit',
        type: 'BOOK',
        rating: 4,
        genres: ['Fantasy', 'Adventure', 'Classic']
      }
    ]
  };
};