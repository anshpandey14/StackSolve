import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Questions from "./pages/Questions";
import QuestionDetail from "./pages/QuestionDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import AskQuestion from "./pages/AskQuestion";
import Tags from "./pages/Tags";
import NotFound from "./pages/NotFound";
import VerifyEmail from "./pages/VerifyEmail";
import { Navbar } from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import { useAuthStore } from "./store/auth";

function App() {
  const { hydrated } = useAuthStore();

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="dark bg-black text-white min-h-screen antialiased">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/questions/ask" element={<AskQuestion />} />
            <Route
              path="/questions/:quesId/:quesName/edit"
              element={<AskQuestion />}
            />
          </Route>

          <Route
            path="/questions/:quesId/:quesName"
            element={<QuestionDetail />}
          />

          {/* Auth Routes */}
          <Route element={<AuthRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/users" element={<Users />} />
          <Route path="/questions/tags" element={<Tags />} />
          <Route path="/users/:userId/:userSlug" element={<Profile />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
