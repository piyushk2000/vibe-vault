import { Box, Pagination } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import SimpleMediaCard from "../../../../components/cards/SimpleMediaCard";
import { useEffect, useState } from "react";
import { RequestServer } from "../../../../config/api";
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

  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState<Series | null>(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState<any>(null);

  const searchText = useSelector((state: any) => state.searchText.value);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const queryParams = new URLSearchParams({
          query: searchText || 'series',
          page: currentPage.toString()
        });
        const response = await RequestServer(`/media/series?${queryParams}`, 'GET');
        setData(response?.data?.results || []);
        setTotalPage(response?.data?.total_pages || 1);
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

// Handle card click for Series
const handleCardClick = async (item: Series) => {
  dispatch(setLoading(true));
  try {
      const response = await RequestServer(`/media/series/${item.id}`, 'GET');
      setSelectedItemDetails(response?.data);
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mx: 5 }}>
        <Grid container spacing={2} justifyContent="center">
          {data?.map((series) => (
            <Grid my={2} key={series.id} onClick={() => handleCardClick(series)}>
              <SimpleMediaCard
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
