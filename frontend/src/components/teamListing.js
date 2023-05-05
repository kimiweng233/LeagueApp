function TeamListing(prop) {

    function joinButton() {
        if (prop.teamJoiningMode == "public") {
            return (
                <button>Join</button>
            )
        } else if (prop.teamJoiningMode == "request-only") {
            return (
                <button>Send Request</button>
            )
        }
    }

    return (
        <div>
        <p>{prop.teamName}</p>
        {joinButton()}
        </div>
    );
}
  
export default TeamListing;