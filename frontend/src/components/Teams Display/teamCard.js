const TeamCard = (ButtonsList) => {

    function WrappedComponent(props) {

        return (
            <div>
                <p>{props.teamName}</p>
                {ButtonsList.map( (button, i) => {
                    return <button.button key={i} {...button.props(props)} />
                })}
            </div>
        );
  }
  return WrappedComponent;
};

export default TeamCard;