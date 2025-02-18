import { gql, useQuery } from '@apollo/client'
import Character from './Character'
import './Characters.css'

// Define a query with gql. 
// If your query uses vars you'll need to define them! 
const GET_CHARACTERS = gql`
query Characters {
  characters {
    name
    initiative
    id
  }
}
`

function Characters() {
  // setup your lazy query
  // The first parmaeter is a function that will run this query
  const { loading, error, data } = useQuery(GET_CHARACTERS)
  
  return (
    <div className="Characters">
      {/* use the query parmeters like this */}
      {/* Checking loading, tru when loading */}
      {loading && <p>Loading...</p>}
      {/* Check for errors */}
      {error && <p>Error: {error.message}</p>}
      {/* Display your data */}
      {data && (
          data.characters.map((character) => (
            <Character className="row" key={character.id} {...character} />
          ))
      )}
    </div>
  );
}

export default Characters