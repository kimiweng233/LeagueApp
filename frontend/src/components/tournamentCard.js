import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TournamentCard = (ButtonOne, ButtonTwo, func1Props, func2Props) => {

    function WrappedComponent(props) {

        const buttonOneProps = func1Props(props);
        const buttonTwoProps = func2Props(props);

        return (
            <div>
                <p>{props.tournamentName}</p>
                <ButtonOne {...buttonOneProps} />
                <ButtonTwo {...buttonTwoProps} />
            </div>
        );
  }
  return WrappedComponent;
};

export default TournamentCard;