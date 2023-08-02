import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
import AppNavbar from "./components/Utilities/navBar";
import Footer from "./components/Utilities/footer";

import Test from "./pages/test";

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
                            <Route exact path="/test" element={<Test />} />
                            <Route exact path="/*" element={<Home />} />
                        </Routes>
                        <ReactQueryDevtools initialIsOpen={false} />
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
