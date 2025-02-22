import { Box, Pagination } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MediaCard from "../../../../components/cards";
import { setLoading } from "../../../../redux/loadingSlice";
import { SearchStateRoot } from "../../../../redux/searchSlice";
import { getDataFromServer } from "../../../../services/fetchData";
import DetailDialog from "../../../details-view";

interface Anime {
  id: number;
  image: {
    original: string;
  };
  name: string;
  synopsis: string;
}

interface AnimeResponse {
  data: Anime[];
}

const AnimeList = () => {
  const [data, setData] = useState<Anime[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Anime | null>(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState<Anime | null>(
    null
  );
  const theme = useTheme();
  const dispatch = useDispatch();
  const searchText = useSelector(
    (state: SearchStateRoot) => state.searchText.value
  );

  const fetchAnimeList = async () => {
    const responseData = await getDataFromServer<AnimeResponse>({
      endPoint: "/media/anime",
      customParams: {
        page: currentPage,
        limit: 20,
        order: "ranked",
        search: searchText,
      },
    });
    console.log({ responseData });

    if (!responseData) {
      // Handle null case (optional error logging here)
      console.warn("Failed to fetch anime data");
      return;
    }
    setData(responseData.data);
    setTotalPage(10); // Set a reasonable default or calculate based on total items
  };

  async function Setup() {
    dispatch(setLoading(true));
    fetchAnimeList();
    dispatch(setLoading(false));
  }

  useEffect(() => {
    Setup();
  }, [currentPage, searchText, dispatch]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const getSingleAnimeData = async (item: Anime) => {
    dispatch(setLoading(true));
    const responseData = await getDataFromServer<Anime>({
      endPoint: `/media/anime/${item.id}`,
    });
    if (!responseData) {
      // Handle null case (optional error logging here)
      console.warn("Failed to fetch data");
      return;
    }

    setSelectedItemDetails(responseData);
    setSelectedItem(item);
    dispatch(setLoading(false));
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setSelectedItemDetails(null);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Cards Grid */}
      <Grid container spacing={2} justifyContent="center">
        {data?.map((anime) => (
          <Grid key={anime.id} my={2} onClick={() => getSingleAnimeData(anime)}>
            <MediaCard
              imageUrl={`https://shikimori.one${anime.image.original}`}
              showName={anime.name}
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination - Separated with margin */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 4,
          marginBottom: 2,
          width: "100%",
        }}
      >
        <Pagination
          count={totalPage}
          page={currentPage}
          color="primary"
          onChange={handlePageChange}
          sx={{
            "& .Mui-selected": {
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
          discription={selectedItemDetails.synopsis}
          imageUrl={`https://shikimori.one${selectedItem.image.original}`}
        />
      )}
    </Box>
  );
};

export default AnimeList;
