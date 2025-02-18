import { useMutation, gql } from '@apollo/client'
import './Character.css'

const DELETE_CHARACTER = gql`
mutation Delete($deleteCharacterId: ID!) {
  deleteCharacter(id: $deleteCharacterId)
}
`

function Character({ name, initiative, id }) {
  const [deleteCharacter, { loading, error }] = useMutation(DELETE_CHARACTER, {
    update(cache, { data: { deleteCharacter } }) {
      if (!deleteCharacter) return; // If deletion failed, do nothing

      cache.modify({
        fields: {
          characters(existingCharacters = [], { readField }) {
            return existingCharacters.filter(
              (characterRef) => readField("id", characterRef) !== id
            );
          }
        }
      });
    }
  });

  return (
    <div className="Character">
      <h1 className='name'>{name}</h1>
      <p className="initiative">Init: {initiative}</p>
      <button
        onClick={() => {
          deleteCharacter({ variables: { deleteCharacterId: id } });
        }}
        disabled={loading}
      >
        {loading ? "Deleting..." : "X"}
      </button>
      {error && <p className="error">Error deleting character</p>}
    </div>
  );
}

export default Character;
