import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBRow,
  MDBCardSubTitle,
  MDBBtnGroup,
} from "mdb-react-ui-kit";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Recommendations from "./Recommendations";

const genreList = [
  "Personal Growth",
  "True Crime and Investigative Journalism",
  "History",
  "Comedy",
  "Entertainment",
  "Business",
  "Fiction",
  "News",
  "Kids and Family",
];

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        PodCastle
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function LandingPage(props) {
  const { showsData, onShowClick } = props;
  const { previewData } = showsData;

  const [sortingMethod, setSortingMethod] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const navigate = useNavigate();

  const shortenString = (text, maxLength, readMoreText = "... Read more") => {
    if (text.length <= maxLength) {
      return text;
    }
    const shortenedText = text.slice(0, maxLength).trim();
    return `${shortenedText}${readMoreText}`;
  };

  const sortData = (method) => {
    switch (method) {
      case "A-Z":
        return previewData
          .slice()
          .sort((a, b) => a.title.localeCompare(b.title));
      case "Z-A":
        return previewData
          .slice()
          .sort((a, b) => b.title.localeCompare(a.title));
      case "MOST RECENT":
        return previewData
          .slice()
          .sort((a, b) => new Date(b.updated) - new Date(a.updated));
      case "LEAST RECENT":
        return previewData
          .slice()
          .sort((a, b) => new Date(a.updated) - new Date(b.updated));
      default:
        return previewData;
    }
  };

  const sortedData = sortData(sortingMethod);

  // Filter the data based on the search query and selected genre
  const filteredData = sortedData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDataByGenre =
    selectedGenre === "All"
      ? filteredData
      : filteredData.filter((item) =>
          item.genres.includes(genreList.indexOf(selectedGenre) + 1)
        );

  const elements = filteredDataByGenre.map((item) => {
    const { id, title, description, seasons, image, genres, updated } = item;

    const maxLength = 100;
    const shortenedDescription = shortenString(description, maxLength);
    const genresWithNames = genres
      ? genres.map((num) => genreList[num - 1])
      : [];

    const handleShowClick = (showId) => {
      onShowClick(showId);
      navigate(`/shows/${showId}`);
    };

    function formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");

      return `${day}-${month}-${year}`;
    }

    return (
      <Grid
        item
        key={id}
        xs={12}
        sm={6}
        md={4}
        onClick={() => handleShowClick(id)}
      >
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CardMedia
            component="div"
            sx={{
              // 16:9
              pt: "100%",
            }}
            image={image}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography>{shortenedDescription}</Typography>
          </CardContent>
          <CardActions>
            <Typography size="small">{genresWithNames.join(", ")}</Typography>
            <Typography size="small">
              Last updated: {formatDate(updated)}
            </Typography>
          </CardActions>
        </Card>
      </Grid>
    );
  });

  const handleSortChange = (event) => {
    setSortingMethod(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle1" color="inherit">
              Sort by:
            </Typography>
            <Select
              value={sortingMethod}
              onChange={handleSortChange}
              variant="outlined"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="A-Z">A-Z</MenuItem>
              <MenuItem value="Z-A">Z-A</MenuItem>
              <MenuItem value="MOST RECENT">Most Recent</MenuItem>
              <MenuItem value="LEAST RECENT">Least Recent</MenuItem>
            </Select>
          </Stack>

          {/* New dropdown for sorting by genre */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle1" color="inherit">
              Sort by Genre:
            </Typography>
            <Select
              value={selectedGenre}
              onChange={handleGenreChange}
              variant="outlined"
            >
              <MenuItem value="All">All Genres</MenuItem>
              {genreList.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          {/* Add the search bar */}
          <input
            type="text"
            placeholder="Search shows..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </Toolbar>
      </AppBar>
      <main>
        <Container sx={{ py: 2 }} maxWidth="md">
          <Grid container spacing={4}>
            {elements}
          </Grid>
        </Container>
      </main>
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
    </ThemeProvider>
  );
}

export default LandingPage;

// export default function LandingPage(props) {
//   const { showsData, onShowClick } = props;
//   const { previewData } = showsData;

//   const [sortingMethod, setSortingMethod] = useState('All');
//   const navigate = useNavigate(); // Use useNavigate hook

//   const shortenString = (text, maxLength, readMoreText = "... Read more") => {
//     if (text.length <= maxLength) {
//       return text;
//     }
//     const shortenedText = text.slice(0, maxLength).trim();
//     return `${shortenedText}${readMoreText}`;
//   };

//   const sortData = (method) => {
//     switch (method) {
//       case 'A-Z':
//         return previewData.slice().sort((a, b) => a.title.localeCompare(b.title));
//       case 'Z-A':
//         return previewData.slice().sort((a, b) => b.title.localeCompare(a.title));
//       case 'MOST RECENT':
//         return previewData.slice().sort((a, b) => new Date(b.updated) - new Date(a.updated));
//       case 'LEAST RECENT':
//         return previewData.slice().sort((a, b) => new Date(a.updated) - new Date(b.updated));
//       default:
//         return previewData;
//     }
//   };

//   const sortedData = sortData(sortingMethod);

//   const elements = sortedData.map((item) => {
//     const { id, title, description, seasons, image, genres, updated } = item;

//     const maxLength = 60;
//     const shortenedDescription = shortenString(description, maxLength);
//     const genresWithNames = genres ? genres.map((num) => genreList[num - 1]) : [];

//     const handleShowClick = (showId) => {
//       onShowClick(showId); // Update the currentShow in the parent component's state
//       navigate(`/shows/${showId}`); // Programmatically navigate to the ShowDetails route using useNavigate
//     };

//     return (
//       <div key={id} onClick={() => handleShowClick(id)}>
//         <MDBCard>
//           <MDBCardImage src={image} position='top' alt='...' />
//           <MDBCardBody>
//             <MDBCardTitle>{title}</MDBCardTitle>
//             <MDBCardSubTitle>{genresWithNames.join(", ")}</MDBCardSubTitle>
//             <MDBCardText>{shortenedDescription}</MDBCardText>
//           </MDBCardBody>
//         </MDBCard>
//       </div>
//     );
//   });

//   const handleSortButtonClick = (method) => {
//     setSortingMethod(method);
//   };

//   return (
//     <>
//       <MDBBtnGroup toolbar role='toolbar' aria-label='Toolbar with button groups' className='tool-container'>
//         <MDBBtnGroup size='sm' className='me-2 toolbar' aria-label='First Group'>
//           <MDBBtn onClick={() => handleSortButtonClick('All')}>All</MDBBtn>
//           <MDBBtn onClick={() => handleSortButtonClick('A-Z')}>A-Z</MDBBtn>
//           <MDBBtn onClick={() => handleSortButtonClick('Z-A')}>Z-A</MDBBtn>
//           <MDBBtn onClick={() => handleSortButtonClick('MOST RECENT')}>MOST RECENT</MDBBtn>
//           <MDBBtn onClick={() => handleSortButtonClick('LEAST RECENT')}>LEAST RECENT</MDBBtn>
//         </MDBBtnGroup>
//       </MDBBtnGroup>
//       <MDBRow>
//         {elements}
//       </MDBRow>
//     </>
//   );
// }
