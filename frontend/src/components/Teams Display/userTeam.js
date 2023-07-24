import { useNavigate } from "react-router-dom";

import TeamCard from "./teamCard";

function UserTeam(props) {
    const navigate = useNavigate();

    const viewTeamButton = (props) => {
        return <button onClick={props.onClick}>View Team</button>;
    };

    const viewTeamFunc = (props) => {
        return {
            onClick: () => navigate(`/team?teamID=${props.id}`),
        };
    };

    const WrappedComponent = TeamCard([
        { button: viewTeamButton, props: viewTeamFunc },
    ]);

    return <WrappedComponent {...props} />;
}

export default UserTeam;
