import { BsDiscord } from "react-icons/bs";
import { useLocation } from "react-router-dom";

import "../../assets/css/footer.css";

const Footer = () => {
    const location = useLocation();

    if (location.pathname != "/") {
        return (
            <div className="footerWrapper footerMargin">
                <h3>
                    Join our <BsDiscord className="discordSymbol" /> !
                </h3>
            </div>
        );
    }
};

export default Footer;
