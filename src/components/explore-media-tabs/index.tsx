import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { COLORS } from '../../theme/colors';
import AnimeList from '../../pages/Explore/sub-category/anime';
import MoviesList from '../../pages/Explore/sub-category/movies';
import SeriesList from '../../pages/Explore/sub-category/series';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ExploreMediaType() {
  const [value, setValue] = React.useState(0);

  //@ts-ignore
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          TabIndicatorProps={{ style: { backgroundColor: COLORS.TAB + ' !important' } }}
          sx={{
            '& .MuiTab-root': {
              color: COLORS.TAB_INACTIVE + ' !important',
            },
            '& .Mui-selected': {
              color: COLORS.TAB_SELECTED_TEXT + ' !important', // Use the new color for selected tab text
              backgroundColor: COLORS.TAB_SELECTED_BACKGROUND + ' !important',
            },
            // Add hover effect for tabs
            '& .MuiTab-root:hover': {
              backgroundColor: COLORS.HOVER + ' !important',
            },
          }}
        >
          <Tab label="Anime" {...a11yProps(0)} />
          <Tab label="Movies" {...a11yProps(1)} />
          <Tab label="TV-Shows" {...a11yProps(2)} />
          {/* <Tab label="Books" {...a11yProps(3)} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AnimeList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MoviesList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SeriesList />
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={3}>
        Item Four
      </CustomTabPanel> */}
    </Box>
  );
}