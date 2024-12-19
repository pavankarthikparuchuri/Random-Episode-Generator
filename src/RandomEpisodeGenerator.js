import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Grid, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import Alert from '@mui/material/Alert';

export default function RandomEpisodeGenerator() {
  const [sitcomData, setSitcomData] = React.useState({});
  const [SITCOM_ID, setSitCOM_ID] = useState('');
  const [isOpen, setIsOpen] = React.useState(true);
  const [loader, setLoader] = React.useState(false);
  const [alertStatus, setAlertStatus] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertOpen, setAlertOpen] = React.useState(false);


  const handleInputChange = (event) => {
    setSitCOM_ID(event.target.value);
  };

  const handleSubmit = () => {
    if (SITCOM_ID) {
     fetchSeason(); // Pass the series name to the parent or handle here
     setIsOpen(false);
    } else {
      alert('Please enter a series name');
    }
  };

  const API_KEY = '4036f631';
  const BASE_URL = 'https://www.omdbapi.com/';
  async function fetchSeason() {
    try {
      setLoader(true);
      const url = `${BASE_URL}?apikey=${API_KEY}&t=${SITCOM_ID}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching sitcom data: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data, "::data");

      if (data.Type === "movie") {
        setSitcomData(data);
        setLoader(false);
        setAlertStatus("warning");
        setAlertMessage("oops! This isn't a series, it's a movie!");
        setAlertOpen(true);
        return;
      } else {
        let randomSeason = Math.floor(Math.random() * data.totalSeasons) + 1;
        const episodeUrl = `${BASE_URL}?apikey=${API_KEY}&t=${SITCOM_ID}&Season=${randomSeason}`;
        const episodeResponse = await fetch(episodeUrl);
        if (!episodeResponse.ok) {
          throw new Error(`Error fetching episode data: ${episodeResponse.statusText}`);
        }
        const EpisodesData = await episodeResponse.json();
        let randomEpisode = EpisodesData.Episodes[Math.floor(EpisodesData.Episodes.length * Math.random())].Episode;
        const episodeInfoUrl = `${BASE_URL}?t=${SITCOM_ID}&Season=${randomSeason}&Episode=${randomEpisode}&apikey=${API_KEY}`;
        const episodeInfoApi = await fetch(episodeInfoUrl);
        if (!episodeInfoApi.ok) {
          throw new Error(`Error fetching episode info data: ${episodeInfoApi.statusText}`);
        }
        const episodeInfoJson = await episodeInfoApi.json();
        console.log(episodeInfoJson, "::episodeInfoJson");
        setSitcomData(episodeInfoJson);
        setLoader(false);
        setAlertStatus("success");
        setAlertMessage("Random Episode Generated");
        setAlertOpen(true);
      }
    } catch (error) {
      setLoader(false);
      setSitCOM_ID("");
      setIsOpen(true);
      console.error('Error fetching sitcom data:', error);
      setAlertStatus("error");
      setAlertMessage("Couldn't find the series");
      setAlertOpen(true);
    }
  }

  return (
    <>
   <Snackbar
        open={alertOpen}  // Control Snackbar visibility
        autoHideDuration={5000}  // Automatically hide after 5 seconds
        onClose={()=> setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}  // Position of the Snackbar
      >
        <Alert
          onClose={()=> setAlertOpen(false)}
          severity={alertStatus}  // Use the alertStatus state to set the severity
          sx={{ width: '100%' }}
          variant="filled"
        >
          {alertMessage}  
        </Alert>
      </Snackbar>
    {isOpen && (<Box sx={{ width: '100%',  minHeight: "78vh", display: "flex" }}>
            <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={8} md={6} lg={4}>
                <Typography variant="h5" align="center" gutterBottom>
                    Enter Series Name
                </Typography>
                <TextField
                    fullWidth
                    label="Series Name"
                    variant="outlined"
                    value={SITCOM_ID}
                    onChange={handleInputChange}
                    sx={{ marginBottom: 2 }}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Enter
                </Button>
                </Grid>
            </Grid>
       </Box>)}
   {!isOpen && (<Grid container justifyContent="center" sx={{minHeight: "78vh"}} alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
       {!loader ? (<Card sx={{ width: '100%', minHeight: "78vh", display: 'flex', flexDirection: 'column', margin: 'auto' }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="300"  // Increase the height of the image
              alt="Episode Poster"
              src={sitcomData?.Poster}
              sx={{
                objectFit: 'contain',  // Ensures the image covers the area without distortion
                width: '100%',
                height: 'auto',
                maxHeight: "400px"
              }}
            />
          </CardActionArea>
          <CardContent sx={{ paddingTop: 2 }}>
            <Typography gutterBottom variant="h5" component="div">
              {sitcomData?.Title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Plot:</strong> {sitcomData?.Plot || "Loading..."}
            </Typography>
            {sitcomData.Episode && (<Typography variant="body2" color="text.secondary">
              <strong>Episode:</strong> {sitcomData?.Episode || "Loading..."}
            </Typography>)}
            {sitcomData.Season && (<Typography variant="body2" color="text.secondary">
              <strong>Season:</strong> {sitcomData?.Season || "Loading..."}
            </Typography>)}
            <Typography variant="body2" color="text.secondary">
              <strong>Year:</strong> {sitcomData?.Year || "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Rated:</strong> {sitcomData?.Rated || "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Released:</strong> {sitcomData?.Released || "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Runtime:</strong> {sitcomData?.Runtime || "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Genre:</strong> {sitcomData?.Genre || "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Director:</strong> {sitcomData?.Director || "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Writer:</strong> {sitcomData?.Writer || "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Actors:</strong> {sitcomData?.Actors || "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Language:</strong> {sitcomData?.Language|| "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Country:</strong> {sitcomData?.Country || "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Awards:</strong> {sitcomData?.Awards || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>IMDb Rating:</strong> {sitcomData?.imdbRating || "Loading..."}
            </Typography>
            <Box sx={{display: "flex", gap: "5px", alignItems: "center", justifyContent: "center"}}>
            <Button
                  variant="contained"
                  color="primary"
                  onClick={()=> {setIsOpen(true); setSitCOM_ID(""); setSitcomData({})}}  // Handle button click
                  sx={{ marginTop: 2 }}
                >
                  Start Over
            </Button>
            <Button
                  variant="contained"
                  color="primary"
                  onClick={fetchSeason}  // Handle button click
                  sx={{ marginTop: 2 }}
                >
                  Regenerate
                </Button>
                </Box>
          </CardContent>
        </Card>)
              :
        (<div class="spinner">
        <div></div>   
        <div></div>    
        <div></div>    
        <div></div>    
        <div></div>    
        <div></div>    
        <div></div>    
        <div></div>    
        <div></div>    
        <div></div>    
        </div>)}
      </Grid>
    </Grid>)}
    </>
  );
}
