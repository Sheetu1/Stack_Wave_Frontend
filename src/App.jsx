import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyOTP from "./pages/VerifyOTP";
import LandingPage from "./pages/LandingPage";
import { useDispatch, useSelector } from "react-redux";
import BodyLayout from "./pages/BodyLayout";
import Dashboard from "./pages/Dashboard";
import QuestionPage from "./pages/QuestionPage";
import AskPage from "./pages/AskPage";
import QuestionDetailsPage from "./pages/QuestionDetailsPage";
import CreateRoomsPage from "./pages/CreateRoomPage";
import PageNotFound from "./components/PageNotFound";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./utils/constants";
import { addUser } from "./store/userSlice";
import RoomPage from "./pages/RoomPage";
import EditQuestionPage from "./pages/EditQuestionPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import LeaderBoard from "./pages/LeaderboardPage";

function App() {

  const clientId = import.meta.env.VITE_CLIENT_ID;
  const themeMode = useSelector(state => state.theme.mode);
  console.log(themeMode);
  
  const { token: tokenFromStore } = useSelector(state => state.user);
  const isUserAuthenticated = !!tokenFromStore;
  const dispatch = useDispatch();


  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");

    if (tokenFromStorage && !tokenFromStore) {
      console.log("Token found in storage, fetching user data...");
      axios.get(BASE_URL + "/api/auth/me", {
          headers: { Authorization : `bearer ${tokenFromStorage}` }
      })
      .then((res) => {
          console.log("User data fetched:", res.data);
          if (res.data && res.data.user) {
            dispatch(addUser({ user: res.data.user, token: tokenFromStorage }));
          } else {
             console.error("Invalid token or user data not found.");
             localStorage.removeItem("token");
          }
      })
      .catch((err) => {
         console.error("Error fetching user data:", err);
         localStorage.removeItem("token");
      });
    }
  }, [tokenFromStore]);


  useEffect(() => {
    const root = window.document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ isUserAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage/> } />
            <Route path="/verify" element={<VerifyOTP />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route element={<BodyLayout isAuthenticated={isUserAuthenticated} />} >
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/questions" element={<QuestionPage/>} />
              <Route path="/ask" element={<AskPage />} />
              <Route path="/question/:id" element={<QuestionDetailsPage />} />
              <Route path="/question/:id/edit" element={<EditQuestionPage/>} />
              <Route path="/rooms" element={ <CreateRoomsPage/>} />
              <Route path="/room/:roomId" element={<RoomPage/>} />
              <Route path="/profile/:userId" element={<ProfilePage/>} />
              <Route path="/profile/:userId/edit" element={<EditProfilePage/> } />
              <Route path="/leaderboard" element={<LeaderBoard/>} />
            </Route>
          <Route path="*" element={<PageNotFound/>} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={false}/>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
