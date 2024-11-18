import { Box, Grid2, Pagination } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import MediaCard from "../../../../components/cards";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../../../redux/loadingSlice";
import Grid from '@mui/material/Grid2';

interface Series {
  imdbID: string;
  Poster: string;
  Title: string;
}

const SeriesList = () => {
  const [data, setData] = useState<Series[]>([]);
  const itemsPerPage = 10;
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const theme = useTheme();
  const dispatch = useDispatch();

  const searchText = useSelector((state: any) => state.searchText.value);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(`https://www.omdbapi.com/`, {
          params: {
            apikey: '1998618b',
            s: searchText || 'series',
            type: 'series',
            page: currentPage
          }
        });
        setData(response.data.Search || []);
        setTotalPage(Math.ceil(response.data.totalResults / itemsPerPage));
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

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
        <Grid container spacing={2} justifyContent="center">
          {data.map((movie) => (
            <Grid my={2} key={movie.imdbID}>
              <MediaCard
                imageUrl={movie.Poster}
                showName={movie.Title}
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
    </>
  );
};

export default SeriesList;
