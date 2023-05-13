import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import services from '../../services'

function RoleButton(props) {

    const [color, setColor] = useState("black");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (props.summonerID == null) {
            setColor("black");
        } else if (props.summonerID == localStorage.getItem("summonerID")) {
            setColor("orange");
        } else {
            setColor("blue");
        }
    }, []);

    const handleClick = () => {
        if (props.summonerID == null) {
            services.changeTeamRole({
                "teamID": searchParams.get("teamID"),
                "summonerID": localStorage.getItem("summonerID"),
                "newRole": props.role,
            }).then( response => {
                window.location.reload();
            })
        }
    }

    return (
        <div>
            <p onClick={handleClick} style={{color: color}}>{props.role}</p>
        </div>
    );
}
  
export default RoleButton;