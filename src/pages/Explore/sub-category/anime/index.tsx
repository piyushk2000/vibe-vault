import { Box, Grid2, Pagination } from "@mui/material"
import { useTheme } from '@mui/material/styles';
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../redux/loadingSlice";

import MediaCard from "../../../../components/cards"
import { useEffect, useState } from "react"
import axios from "axios";
import { useSelector } from "react-redux";

interface Anime {
  id: number;
  image: {
    original: string;
  };
  name: string;
}

const AnimeList = () => {
  const [data, setData] = useState<Anime[]>([]);
  const itemsPerPage = 48;
  const [totalPage, setTotalPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<string>('ranked');
  const theme = useTheme();
  const dispatch = useDispatch();

  const searchText = useSelector((state: any) => state.searchText.value)

  console.log("🚀 ~ AnimeList ~ searchText:", searchText)


  useEffect(() => {
    setTotalPage(currentPage + 9);
  }, [currentPage]);

  const fetchData = async () => {
    dispatch(setLoading(true));
    try {
      
      const response = await axios.get<Anime[]>(`https://shikimori.one/api/animes`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          order: sortOption,
          search: searchText
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData()
  }, [currentPage,sortOption,searchText])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    sessionStorage.setItem('pageNumber', value.toString());
  };

  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(event.target.value);
  // };

  // const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSortOption(event.target.value);
  // };

  // const handleSearchClick = () => {
  //   fetchData();
  // };

  // console.log(data)

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
        <Grid2 container gap={5} px={10}>
          {data.map((anime) => (
            <Grid2 key={anime?.id} >
              <MediaCard
                imageUrl={`https://shikimori.one${anime?.image?.original}`}
                showName={anime?.name}
              />
            </Grid2>
          ))}
        </Grid2>

        <Box sx={{ display: 'inline', justifyContent: 'center', marginTop: 2, mb: 2 }}>
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
  )
}

export default AnimeList