import { BsDiscord } from "react-icons/bs";
import { useLocation } from "react-router-dom";

import { DISCORD_INVITATION_LINK } from "../../constants";

import "../../assets/css/footer.css";

const Footer = () => {
    const location = useLocation();

    if (location.pathname != "/") {
        return (
            <div className="footerWrapper footerMargin">
                <h3
                    className="footerLink"
                    onClick={() => {
                        window.open(DISCORD_INVITATION_LINK, "_blank");
                    }}
                >
                    Join our <BsDiscord className="discordSymbol" /> !
                </h3>
            </div>
        );
    }
};

export default Footer;
