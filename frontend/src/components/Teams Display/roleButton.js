import { useSearchParams } from "react-router-dom";

import { positionImgSwitch } from "../../utilities/imageSwitches";

import services from "../../services";

function RoleButton(props) {
    const [searchParams] = useSearchParams();

    const handleClick = () => {
        services
            .changeTeamRole({
                teamID: searchParams.get("teamID"),
                summonerID: localStorage.getItem("summonerID"),
                newRole: props.role,
            })
            .then((response) => {
                window.location.reload();
            });
    };

    return (
        <div className="positionSelectionImgWrapper">
            <img
                className="positionSelectionImg"
                src={positionImgSwitch(props.role)}
                onClick={handleClick}
            />
        </div>
    );
}

export default RoleButton;
