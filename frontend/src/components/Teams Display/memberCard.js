function MemberCard(props) {

    return (
        <div>
            { Object.values(props.roles).includes(props.summonerID) ? (
                <p>{Object.keys(props.roles).find(key => props.roles[key] == props.summonerID)}</p>
            ) : (
                <p>No Role Selected</p>
            )}
            <a target="_blank" rel="noopener noreferrer" href={"https://www.op.gg/summoners/na/" + props.summonerID}>{props.summonerID}</a>
            { props.rank ? (
                <p>{props.rank}</p>
            ) : (
                <p>No Rank</p>
            )}
        </div>
    );
}
  
export default MemberCard;