import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/home";
import TournamentForm from "./pages/tournamentCreation";
import TournamentsList from "./pages/tournamentsList";
import TeamForm from "./pages/teamCreation";
import TeamsList from "./pages/teamsList";
import TeamMenu from "./pages/teamMenu";
import TeamMenuPublic from "./pages/teamMenuPublic";
import TournamentMenu from "./pages/tournamentMenu";
import LeagueLogin from "./pages/leagueLogin";
import JoinedTeams from "./pages/joinedTeamsList";
import TeamInvite from "./pages/teamInvite";
import Dashboard from "./pages/dashboard";
import TournamentDashboard from "./pages/tournamentDashboard";
import TournamentPlanning from "./pages/tournamentPlanning";
import AppNavbar from "./components/Utilities/navBar";
import Footer from "./components/Utilities/footer";
import Fallback from "./pages/fallback";

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div className="appContentWrapper">
                    <div className="appContentInnerWrapper">
                        <AppNavbar />
                        <Routes>
                            <Route exact path="/" element={<Home />} />
                            <Route
                                exact
                                path="/createTournament"
                                element={<TournamentForm />}
                            />
                            <Route
                                exact
                                path="/tournaments"
                                element={<TournamentsList />}
                            />
                            <Route
                                exact
                                path="/createTeam"
                                element={<TeamForm />}
                            />
                            <Route
                                exact
                                path="/teams"
                                element={<TeamsList />}
                            />
                            <Route exact path="/team" element={<TeamMenu />} />
                            <Route
                                exact
                                path="/teamInfo"
                                element={<TeamMenuPublic />}
                            />
                            <Route
                                exact
                                path="/tournamentPage"
                                element={<TournamentMenu />}
                            />
                            <Route
                                exact
                                path="/linkAccount"
                                element={<LeagueLogin />}
                            />
                            <Route
                                exact
                                path="/joinedTeams"
                                element={<JoinedTeams />}
                            />
                            <Route
                                exact
                                path="/teamInvite"
                                element={<TeamInvite />}
                            />
                            <Route
                                exact
                                path="/dashboard"
                                element={<Dashboard />}
                            />
                            <Route
                                exact
                                path="/tournamentDashboard"
                                element={<TournamentDashboard />}
                            />
                            <Route
                                exact
                                path="/tournamentPlanning"
                                element={<TournamentPlanning />}
                            />
                            <Route exact path="/*" element={<Fallback />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
