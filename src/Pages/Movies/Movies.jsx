import "./Movies.scss";
import { useEffect, useState } from "react";
import { db, auth, storage } from "../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Typography,
  Button,
  CardMedia,
  CardActions,
  CardContent,
  Card,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  LinearProgress,
  Snackbar,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getStorage } from "firebase/storage";

const Movies = () => {
  const navigate = useNavigate();
  const [movieList, setMovieList] = useState([]);
  const [movieData, setMovieData] = useState({
    title: "",
    description: "",
    poster_img: "",
    IMDB: 0,
    isAvailable: true,
    releaseDate: 0,
    userId: "",
  });

  const [fileUpload, setFileUpload] = useState(null);
  const [updateData, setUpdateData] = useState({
    title: "",
    description: "",
    poster_img: "",
    IMDB: 0,
    isAvailable: true,
    releaseDate: 0,
    userId: "",
  });

  const [updatedData, setUpdatedData] = useState({
    title: "",
  });

  const [snackStatus, setSnackStatus] = useState({
    open: false,
    message: "",
  });
  const [dialogStatus, setDialogStatus] = useState({
    open: false,
  });

  const handleClose = () => {
    setSnackStatus({
      open: false,
      message: "",
    });
  };

  const moviesCollectionRef = collection(db, "movies");

  const getMovieData = async () => {
    try {
      const response = await getDocs(moviesCollectionRef);
      console.log(response);
      const filteredData = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData);
      setMovieList(filteredData);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async () => {
    setMovieData({
      ...movieData,
      userId: auth.currentUser.uid,
    });

    console.log("user", auth?.currentUser?.uid);
    try {
      const response = await addDoc(moviesCollectionRef, movieData);
      console.log(response);
      setSnackStatus({
        open: true,
        message: "New Movie added!",
      });

      getMovieData();
    } catch (e) {
      console.log(e);
    }
  };

  const handleUploadFile = async () => {
    if (!fileUpload) {
      setSnackStatus({
        open: true,
        message: "No file were detected",
      });
      return;
    }
    const fileFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      const response = await uploadBytes(fileFolderRef, fileUpload);
      console.log(response);
      setSnackStatus({
        open: true,
        message: "File Uploaded successfull",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {
    setMovieData({
      ...movieData,
      [e.target.name]: e.target.value,
    });
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
    });
  };

  const deleteMovie = async (movieID) => {
    try {
      const movie = doc(db, "movies", movieID);
      await deleteDoc(movie);
      getMovieData();
      setSnackStatus({
        open: true,
        message: "Movie Deleted!",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdatedData = async (movieID) => {
    const reference = doc(db, "movies", movieID);
    await updateDoc(reference, {
      title: updatedData.title,
    });
    getMovieData();
    setSnackStatus({
      open: true,
      message: "Movie Updated",
    });
    setUpdatedData({
      title: "",
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("YOU HAVE BEEN LOGGED OUT!");
        navigate("/");
      }
    });
    getMovieData();
  }, []);

  if (movieList.length === 0)
    return (
      <div className="loading-bar-1">
        <Box sx={{ width: "100%" }} className="loader-b">
          <LinearProgress />
        </Box>
        <img
          src="https://www.icegif.com/wp-content/uploads/2023/01/icegif-162.gif"
          alt=""
        />
        <h1>LOADING...</h1>
      </div>
    );
  return (
    <div className="movies">
      <h1>Movies Page</h1>
      <div className="add-movies">
        <h2>ADD MOVIES</h2>
        <TextField
          id="outlined-basic-4"
          label="Title"
          variant="outlined"
          name="title"
          type="text"
          required
          value={movieData.title}
          onChange={handleChange}
        />
        <TextField
          id="outlined-basic-4"
          label="Description"
          variant="outlined"
          name="description"
          type="text"
          required
          value={movieData.description}
          onChange={handleChange}
        />
        <div className="form-img">
          <TextField
            id="outlined-basic-4"
            variant="outlined"
            name="poster_img"
            type="file"
            required
            onChange={(e) => setFileUpload(e.target.files[0])}
            className="form-img-input"
          />
          <Button variant="contained" onClick={handleUploadFile}>
            SUBMIT
          </Button>
        </div>
        <TextField
          id="outlined-basic-4"
          label="IMDB"
          variant="outlined"
          name="IMDB"
          type="number"
          required
          value={movieData.IMDB}
          onChange={handleChange}
        />
        <TextField
          id="outlined-basic-4"
          label="Release Date"
          variant="outlined"
          name="releaseDate"
          type="number"
          required
          value={movieData.releaseDate}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={movieData.isAvailable}
              onClick={() =>
                setMovieData({
                  ...movieData,
                  isAvailable: !movieData.isAvailable,
                })
              }
            />
          }
          label="Is Available"
        />
        <Button variant="contained" onClick={handleSubmit}>
          SUBMIT
        </Button>
      </div>
      <div className="movies-main">
        {movieList.map((data) => (
          <div key={data.id}>
            <Card sx={{ maxWidth: 345 }} key={data.id}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="350"
                image={data.poster_img}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {data.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  imdb: {data.IMDB} - Release Date: {data.releaseDate}
                </Typography>
              </CardContent>
              <div className="update-card">
                <input
                  type="text"
                  placeholder="New title"
                  required
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData,
                      title: e.target.value,
                    })
                  }
                />
                <Button
                  variant="contained"
                  onClick={() => handleUpdatedData(data.id)}
                >
                  UPDATE
                </Button>
              </div>
              <CardActions>
                <Button
                  size="small"
                  onClick={() =>
                    setDialogStatus({ ...dialogStatus, open: true })
                  }
                >
                  UPDATE
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    deleteMovie(data.id);
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </div>
        ))}
      </div>
      <Snackbar
        open={snackStatus.open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={snackStatus.message}
      />
    </div>
  );
};

export default Movies;