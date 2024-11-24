import { Box, Pagination } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../../redux/loadingSlice";
import MediaCard from "../../../../components/cards";
import { useEffect, useState } from "react";
import axios from "axios";
import Grid from '@mui/material/Grid2';
import DetailDialog from '../../../details-view';

interface Anime {
  id: number;
  image: {
    original: string;
  };
  name: string;
}

const AnimeList = () => {
  const [data, setData] = useState<Anime[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Anime | null>(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState<any>(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const searchText = useSelector((state: any) => state.searchText.value);
  console.log("🚀 ~ AnimeList ~ searchText:", searchText)

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get<Anime[]>(`https://shikimori.one/api/animes`, {
          params: {
            page: currentPage,
            limit: 20, 
            order: 'ranked',
            search: searchText
          }
        });
        setData(response.data);
        // Assuming the API returns total count in headers or response
        setTotalPage(10); // Set a reasonable default or calculate based on total items
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [currentPage, searchText, dispatch]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleCardClick = async (item: Anime) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${item.id}/full`);
      setSelectedItemDetails(response.data.data);
      setSelectedItem(item);
    } catch (error) {
      console.error('Error fetching item details:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setSelectedItemDetails(null);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Cards Grid */}
      <Grid container spacing={2} justifyContent="center">
        {data.map((anime) => (
          <Grid key={anime.id} my={2} onClick={() => handleCardClick(anime)}>
            <MediaCard
              imageUrl={`https://shikimori.one${anime.image.original}`}
              showName={anime.name}
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination - Separated with margin */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: 4,
        marginBottom: 2,
        width: '100%'
      }}>
        <Pagination
          count={totalPage}
          page={currentPage}
          color="primary"
          onChange={handlePageChange}
          sx={{
            '& .Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          }}
        />
      </Box>

      {/* Detail Dialog */}
      {selectedItem && selectedItemDetails && (
        <DetailDialog
          open={Boolean(selectedItem)}
          onClose={handleCloseDialog}
          item={selectedItemDetails}
          imageUrl={selectedItemDetails.images.jpg.large_image_url}
        />
      )}
    </Box>
  );
};

export default AnimeList;