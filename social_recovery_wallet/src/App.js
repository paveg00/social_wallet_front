import React from "react";
import Navbar from "./components/NavBar/NavBar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages/index";
import RegisterGuardians from "./pages/register_guardians";
import SocialRecovery from "./pages/social_recovery";
import AcceptSocialRecoveryPage from "./pages/approve_social_recovery";
 
function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route
                    path="/register_guardians"
                    element={<RegisterGuardians />}
                />
                <Route
                    path="/social_recovery"
                    element={<SocialRecovery />}
                />
                <Route
                    path="/accept_recovery"
                    element={<AcceptSocialRecoveryPage />}
                />
            </Routes>
        </Router>
    );
}
 
export default App;