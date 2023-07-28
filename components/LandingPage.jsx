import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBRow, MDBCardSubTitle, MDBBtnGroup } from 'mdb-react-ui-kit';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function LandingPage(props) {

  const { showsData, onShowClick } = props;
  const { previewData } = showsData;

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Album layout
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Album layout
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Something short and leading about the collection below—its contents,
              the creator, etc. Make it short and sweet, but not too short so folks
              don&apos;t simply skip over it entirely.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained">Main call to action</Button>
              <Button variant="outlined">Secondary action</Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {previewData.map((item) => {

              const { id, title, description, seasons, image, genres, updated } = item;
              
              return (
                <Grid item key={id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        // 16:9
                        pt: '100%',
                      }}
                      image={image}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {title}
                      </Typography>
                      <Typography>
                        {description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">View</Button>
                      <Button size="small">Edit</Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
             })}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
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
      {/* End footer */}
    </ThemeProvider>
  );
}