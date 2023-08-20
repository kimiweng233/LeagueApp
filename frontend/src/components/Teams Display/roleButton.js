import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSearchParams } from "react-router-dom";

import { positionImgSwitch } from "../../utilities/imageSwitches";

import services from "../../services";
import LoadingScreen from "../Utilities/loadingScreen";

function RoleButton(props) {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const { mutate: changeTeamRole, isLoading: changeTeamRoleLoading } =
        useMutation({
            mutationFn: () =>
                services.changeTeamRole({
                    teamID: searchParams.get("teamID"),
                    summonerID: localStorage.getItem("summonerID"),
                    newRole: props.role,
                }),
            onSuccess: () => {
                const cachedData = queryClient.getQueryData([
                    "team-data",
                    searchParams.get("teamID"),
                ]);
                console.log(cachedData);
                queryClient.setQueryData(
                    ["team-data", searchParams.get("teamID")],
                    {
                        ...cachedData,
                        roles: changeRole(cachedData.rolesFilled, props.role),
                    }
                );
            },
        });

    const handleChangeTeamRole = (event) => {
        event.stopPropagation();
        changeTeamRole();
    };

    const changeRole = (roles, newRole) => {
        Object.keys(roles).forEach((key) => {
            if (roles[key] == localStorage.getItem("summonerID")) {
                roles[key] = null;
            }
        });
        roles[newRole] = localStorage.getItem("summonerID");
        return roles;
    };

    return (
        <div className="positionSelectionImgWrapper">
            {changeTeamRoleLoading && <LoadingScreen />}
            <img
                className="positionSelectionImg"
                src={positionImgSwitch(props.role)}
                onClick={(event) => handleChangeTeamRole(event)}
            />
        </div>
    );
}

export default RoleButton;
