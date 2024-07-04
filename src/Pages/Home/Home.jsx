import "./Home.scss";
import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import {
  updateProfile,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import { Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { TextField } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
  });
  const [updateUser, setUpdateUser] = useState({
    displayName: "",
    photoURL: "",
  });
  const [snack, setSnack] = useState({
    open: false,
    message: "",
  });

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async () => {
    console.log(updateUser);
    try {
      const response = await updateProfile(auth.currentUser, {
        displayName: updateUser.displayName,
        photoURL: updateUser.photoURL,
      });
      setUserData({
        ...userData,
        displayName: updateUser.displayName,
        photoURL: updateUser.photoURL,
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const handleEmailVerification = async () => {
    try {
      const response = await sendEmailVerification(auth.currentUser);
      console.log(response);
      console.log("email verification");
      setSnack({
        open: true,
        message: "Email verification link send",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = (event, reason) => {
    if (reason == "clickaway") return;
    setSnack({ open: false, message: "" });
  };

  const handlePasswordResendMail = async () => {
    try {
      const response = await sendPasswordResetEmail(auth, userData.email);
      setSnack({
        open: true,
        message: "Reset Password send to mail",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await deleteUser(auth.currentUser);
      setSnack({
        open: true,
        message: "Account Deleted successfully",
      });
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("auth listener function");
      if (user) {
        console.log(user);
        console.log("Hiya,", user.email);
        setUserData({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      } else {
        navigate("/");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="home">
      <div className="home-main">
        <nav>
          <h1>HOME</h1>
          <Button variant="contained" onClick={handleSignOut}>
            log out
          </Button>
        </nav>
        <div className="home-display-1">
          {userData.photoURL === null ? (
            <img
              src="https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg"
              alt=""
            />
          ) : (
            <img src={userData.photoURL} alt="img" />
          )}
          <p>
            NAME:{" "}
            {userData.displayName ? userData.displayName : "NO DISPLAY NAME"}
          </p>
          <p>EMAIL: {userData.email}</p>
          <Link to={"/movies"}>
            <Button variant="contained">MOVIES PAGE</Button>
          </Link>
        </div>
        <div className="home-display-2">
          <TextField
            id="outlined-basic-4"
            label="Display Name"
            variant="outlined"
            name="displayName"
            type="text"
            required
            value={updateUser.displayName}
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic-4"
            label="Photo URL"
            variant="outlined"
            name="photoURL"
            type="text"
            required
            value={updateUser.photoURL}
            onChange={handleChange}
          />
          <Button variant="contained" onClick={handleClick}>
            SUBMIT
          </Button>
        </div>
        <div className="home-display-2">
          <Button variant="contained" onClick={handleEmailVerification}>
            EMAIL VERIFICATION
          </Button>
          <Button variant="contained" onClick={handlePasswordResendMail}>
            PASSWORD RESET MAIL
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
          >
            DELETE ACCOUNT
          </Button>
        </div>
      </div>
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        message={snack.message}
        onClose={handleClose}
      />
    </div>
  );
};

export default Home;
