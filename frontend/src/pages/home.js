import { BsDiscord } from "react-icons/bs";

import { DISCORD_INVITATION_LINK } from "../constants";

import "../assets/css/homePage.css";

function Home() {
    return (
        <div className="homePageOuterBackground">
            <div className="homePageBanner">
                <div className="homePageContentWrapper">
                    <h1 className="homePageTitle">
                        Welcome to the Weekly Rumble
                    </h1>
                    <button
                        className="homePageButton"
                        onClick={() => {
                            window.open(DISCORD_INVITATION_LINK, "_blank");
                        }}
                    >
                        <p className="homePageButtonText">
                            Join Us on Discord!
                        </p>
                        <BsDiscord className="homePageDiscordSymbole" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
