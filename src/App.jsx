import { useEffect, useState } from "react";
import "./style.scss";
import { TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import { auth, googleProvider } from "../something/config/firebase";
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("signup");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    firstName: {
      error: false,
      message: "",
    },
    lastName: {
      error: false,
      message: "",
    },
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    setError({
      ...error,
      [e.target.name]: {
        error: false,
        message: "",
      },
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log(userData);
    if (state === "signup" && userData.firstName === "") {
      setError({
        ...error,
        firstName: {
          error: true,
          message: "This field is required",
        },
      });
      setLoading(false);
      return;
    }
    if (state === "signup" && userData.lastName === "") {
      setError({
        ...error,
        lastName: {
          error: true,
          message: "This field is required",
        },
      });
      setLoading(false);
      return;
    }
    if (userData.email === "") {
      setError({
        ...error,
        email: {
          error: true,
          message: "This field is required",
        },
      });
      setLoading(false);
      return;
    }
    if (userData.password === "") {
      setError({
        ...error,
        password: {
          error: true,
          message: "This field is required",
        },
      });
      setLoading(false);
      return;
    }
    try {
      if (state === "signup") {
        const response = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        await updateProfile(auth.currentUser, {
          displayName: userData.firstName + " " + userData.lastName,
          photoURL:
            "https://www.dasimprovfestival.com/wp-content/uploads/2023/08/default-guy-1.jpg",
        });
        console.log(response);
        navigate("/home");
      } else if (state === "login") {
        const response = await signInWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        console.log(response);
        console.log("successfully logged in");
        navigate("/home");
      }
    } catch (e) {
      setLoading(false);
      console.log("error code: ", e.code);
      if (e.code === AuthErrorCodes.EMAIL_EXISTS) {
        setError({
          ...error,
          email: {
            error: true,
            message: "Email already exists",
          },
        });
      } else if (e.code === AuthErrorCodes.WEAK_PASSWORD) {
        setError({
          ...error,
          password: {
            error: true,
            message: "Password should be at least 6 characters",
          },
        });
      } else if (e.code === AuthErrorCodes.INVALID_EMAIL) {
        setError({
          ...error,
          email: {
            error: true,
            message: "Invalid email",
          },
        });
      } else if (e.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
        setError({
          ...error,
          password: {
            error: true,
            message: "Invalid credentials",
          },
        });
      }
      console.log(e);
    }
    setLoading(false);
  };

  const handleGoogleSign = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      console.log(response);
      navigate("/home");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Authentication automatic login");
        navigate("/home");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="app">
      {loading && (
        <div className="loading-bar">
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        </div>
      )}
      <div className="app-main">
        <h1>{state === "signup" ? "Sign Up" : "Login"}</h1>
        <form>
          {state === "signup" ? (
            <div className="sign-up-1">
              <TextField
                id="outlined-basic-1"
                label="First name"
                variant="outlined"
                name="firstName"
                type="text"
                required
                value={userData.firstName}
                onChange={handleChange}
                error={error.firstName.error}
                helperText={error.firstName.message}
              />
              <TextField
                id="outlined-basic-2"
                label="Last Name"
                variant="outlined"
                name="lastName"
                type="text"
                required
                value={userData.lastName}
                onChange={handleChange}
                error={error.lastName.error}
                helperText={error.lastName.message}
              />
            </div>
          ) : (
            ""
          )}
          <TextField
            id="outlined-basic-3"
            label="Email"
            variant="outlined"
            name="email"
            type="email"
            required
            value={userData.email}
            onChange={handleChange}
            error={error.email.error}
            helperText={error.email.message}
          />
          <TextField
            id="outlined-basic-4"
            label="Password"
            variant="outlined"
            name="password"
            type={showPass ? "text" : "password"}
            required
            value={userData.password}
            onChange={handleChange}
            error={error.password.error}
            helperText={error.password.message}
          />
          <div className="already-div">
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPass}
                  onClick={() => setShowPass(!showPass)}
                />
              }
              label={showPass ? "Hide Password" : "Show Password"}
            />
            {state === "signup" ? (
              <p onClick={() => setState("login")}>
                Already having an account? <span>login</span>
              </p>
            ) : (
              <p onClick={() => setState("signup")}>
                Not having an account? <span>create one</span>
              </p>
            )}
          </div>
          <Button variant="contained" className="btn" onClick={handleSubmit}>
            {state === "signup" ? "SIGN UP" : "LOGIN"}
          </Button>
          <button className="google-btn" onClick={handleGoogleSign}>
            <img
              src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-pks9lbdv.png"
              alt=""
            />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
