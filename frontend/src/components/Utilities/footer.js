import { BsDiscord } from "react-icons/bs";

import "../../assets/css/footer.css";

const Footer = () => {
    return (
        <div className="footerWrapper">
            <h3>
                Join our <BsDiscord className="discordSymbol" /> !
            </h3>
        </div>
    );
};

export default Footer;
