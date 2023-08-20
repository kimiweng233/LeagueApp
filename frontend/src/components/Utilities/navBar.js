import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Tooltip } from "react-tooltip";

import { HiOutlineLogin, HiOutlineLogout } from "react-icons/hi";
import { MdOutlineRefresh } from "react-icons/md";

import LoadingScreen from "./loadingScreen";

import { DISCORD_INVITATION_LINK } from "../../constants";

import services from "../../services";

import "../../assets/css/navbar.css";

const AppNavbar = () => {
    const location = useLocation();

    const updateSummonerInfo = (event) => {
        event.preventDefault();
        mutate();
    };

    const { mutate, isLoading, error } = useMutation({
        mutationFn: () =>
            services.updateSummonerInfo({
                summonerID: localStorage.getItem("summonerID"),
            }),
    });

    const logout = () => {
        localStorage.removeItem("summonerID");
        window.location.href = "/linkAccount";
    };

    return (
        <div>
            {isLoading && <LoadingScreen />}
            <Navbar
                className={`${location.pathname != "/" && "navbarMargin"}`}
                bg="dark"
                variant="dark"
                expand="lg"
                sticky="top"
            >
                <Container>
                    <Navbar.Brand href="/" style={{ fontSize: "1.3em" }}>
                        <img
                            src="https://cdn.discordapp.com/icons/745073887171313736/2ce80930ac31de1e9842cd72f9828a8a.webp?size=240"
                            alt="Server Icon"
                            className="rounded-circle"
                            style={{ width: "60px", marginRight: "10px" }}
                            onClick={() => {
                                window.open(DISCORD_INVITATION_LINK, "_blank");
                            }}
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <Nav.Link
                                href="/"
                                style={{ fontSize: "1.3em" }}
                                className="navText"
                            >
                                Home
                            </Nav.Link>
                            {localStorage.getItem("summonerID") != null && (
                                <Nav.Link
                                    href="/tournaments"
                                    style={{ fontSize: "1.3em" }}
                                    className="navText"
                                >
                                    Tournaments
                                </Nav.Link>
                            )}
                            {localStorage.getItem("summonerID") != null && (
                                <Nav.Link
                                    href="/joinedTeams"
                                    style={{ fontSize: "1.3em" }}
                                    className="navText"
                                >
                                    My Teams
                                </Nav.Link>
                            )}
                            {localStorage.getItem("summonerID") != null &&
                                localStorage.getItem("role") == "admin" && (
                                    <Nav.Link
                                        href="/createTournament"
                                        style={{ fontSize: "1.3em" }}
                                        className="navText"
                                    >
                                        New Tournament
                                    </Nav.Link>
                                )}
                            {localStorage.getItem("summonerID") != null &&
                                localStorage.getItem("role") == "admin" && (
                                    <Nav.Link
                                        href="/dashboard"
                                        style={{ fontSize: "1.3em" }}
                                        className="navText"
                                    >
                                        Dashboard
                                    </Nav.Link>
                                )}
                        </Nav>
                        <Nav className="d-flex align-items-center">
                            {localStorage.getItem("summonerID") == null ? (
                                <div>
                                    <span
                                        style={{
                                            color: "white",
                                            cursor: "pointer",
                                            fontSize: "1.3em",
                                        }}
                                        onClick={() =>
                                            (window.location.href =
                                                "/linkAccount")
                                        }
                                        className="navText"
                                    >
                                        Link Account
                                    </span>
                                    <span
                                        style={{
                                            color: "gray",
                                            cursor: "pointer",
                                            fontSize: "1.8em",
                                            marginLeft: "10px",
                                        }}
                                        onClick={() =>
                                            (window.location.href =
                                                "/linkAccount")
                                        }
                                        className="navText"
                                    >
                                        <HiOutlineLogin />
                                    </span>
                                </div>
                            ) : (
                                <div className="">
                                    <span
                                        style={{
                                            color: "white",
                                            cursor: "pointer",
                                            fontSize: "1.3em",
                                        }}
                                        className="navText"
                                    >
                                        {localStorage.getItem("summonerID")}
                                    </span>
                                    <span
                                        style={{
                                            color: "gray",
                                            cursor: "pointer",
                                            fontSize: "1.8em",
                                            marginLeft: "5px",
                                        }}
                                        className="navText"
                                    >
                                        <MdOutlineRefresh
                                            className="refetchButton"
                                            data-tooltip-id="refetchTooltip"
                                            data-tooltip-content="Refetch summoner info"
                                            onClick={updateSummonerInfo}
                                        />
                                        <Tooltip
                                            id="refetchTooltip"
                                            className="tooltipAddOn"
                                        />
                                    </span>
                                    <span
                                        style={{
                                            color: "gray",
                                            cursor: "pointer",
                                            fontSize: "1.8em",
                                            marginLeft: "10px",
                                        }}
                                        onClick={logout}
                                        className="navText"
                                    >
                                        <HiOutlineLogout />
                                    </span>
                                </div>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default AppNavbar;
