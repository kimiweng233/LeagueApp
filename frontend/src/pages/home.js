import { BsDiscord } from "react-icons/bs";

import "../assets/css/homePage.css";

function Home() {
    return (
        <div className="homePageBanner">
            <div className="homePageContentWrapper">
                <h1 className="homePageTitle">Welcome to the Weekly Rumble!</h1>
                <button className="homePageButton">
                    <p className="homePageButtonText">Join Us on Discord!</p>
                    <BsDiscord className="homePageDiscordSymbole" />
                </button>
            </div>
        </div>
    );
}

export default Home;
