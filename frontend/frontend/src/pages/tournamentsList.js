import services from '../services'

function TournamentsList() {

    const meowmeowtest = () => {
      console.log(services.getTournamentsList());
    }

    return (
      <div>
        <p>meow meow</p>
        <button onClick={meowmeowtest}>meow meow</button>
      </div>
    );
  }
  
  export default TournamentsList;