import "./Movies.scss";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { getDocs, collection } from "firebase/firestore";

const Movies = () => {
  const [movieList, setMovieList] = useState([]);

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
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getMovieData();
  }, []);

  return (
    <div className="movies">
      <h1>Movies Page</h1>
    </div>
  );
};

export default Movies;
