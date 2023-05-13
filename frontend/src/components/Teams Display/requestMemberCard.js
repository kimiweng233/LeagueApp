import services from "../../services"
import { useSearchParams } from "react-router-dom";

function RequestMemberCard(props) {

    const [searchParams] = useSearchParams();

    const approveJoin = () => {
        services.joinTeam({
            "summonerID": props.summonerID,
            "teamID": searchParams.get("teamID"),
        }).then( response => {
            window.location.reload();
        })
    }

    return (
        <div>
            <a target="_blank" rel="noopener noreferrer" href={"https://www.op.gg/summoners/na/" + props.summonerID}>{props.summonerID}</a>
            { props.rank ? (
                <p>{props.rank}</p>
            ) : (
                <p>No Rank</p>
            )}
            <button onClick={approveJoin}>Approve</button>
        </div>
    );
}
  
export default RequestMemberCard;