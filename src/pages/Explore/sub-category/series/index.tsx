import { Box, Grid2, Pagination } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import MediaCard from "../../../../components/cards";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../../../redux/loadingSlice";
import Grid from '@mui/material/Grid2';
import DetailDialog from '../../../details-view';

interface Series {
  id: number;
  poster_path: string;
  name: string;
}

const SeriesList = () => {
  const [data, setData] = useState<Series[]>([]);
  const itemsPerPage = 20; // TMDb API returns 20 items per page
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState<Series | null>(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState<any>(null);

  const searchText = useSelector((state: any) => state.searchText.value);
  console.log("🚀 ~ SeriesList ~ searchText:", searchText)

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/tv`, {
          params: {
            api_key: '291df334d6477bfda873f22a41a6f1c9',
            query: searchText || 'series',
            page: currentPage
          },
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOTFkZjMzNGQ2NDc3YmZkYTg3M2YyMmE0MWE2ZjFjOSIsIm5iZiI6MTczMTk1NTMxNC4yODQxNTI3LCJzdWIiOiI2NzNiOGExMjYyNzIyZTc5YTIxNTVhMTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Luf3z_s74-3sqetUzBI1HKvQ95Qkh1zDn71jODiQLQg'
          }
        });
        setData(response.data.results || []);
        setTotalPage(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [currentPage, searchText]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleCardClick = async (item: Series) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${item.id}`, {
        params: {
          api_key: '291df334d6477bfda873f22a41a6f1c9'
        }
      });
      setSelectedItemDetails(response.data);
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
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mx:5 }}>
        <Grid container spacing={2} justifyContent="center">
          {data.map((series) => (
            <Grid my={2} key={series.id} onClick={() => handleCardClick(series)}>
              <MediaCard
                imageUrl={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                showName={series.name}
                
              />
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ display: 'inline', justifyContent: 'center', marginTop: 4, mb: 2 }}>
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
      </Box>

      {selectedItem && selectedItemDetails && (
        <DetailDialog
          open={Boolean(selectedItem)}
          onClose={handleCloseDialog}
          item={selectedItemDetails}
          imageUrl={`https://image.tmdb.org/t/p/w500${selectedItemDetails.poster_path}`}
        />
      )}
    </>
  );
};

export default SeriesList;
