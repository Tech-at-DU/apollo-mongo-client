import { useMutation, gql } from '@apollo/client'
import { useState } from 'react';
import './Character.css'

const DELETE_CHARACTER = gql`
mutation Delete($deleteCharacterId: ID!) {
  deleteCharacter(id: $deleteCharacterId)
}
`

const UPDATE_CHARACTER = gql`
mutation Update($id: ID!, $name: String, $initiative: Int) {
  updateCharacter(id: $id, name: $name, initiative: $initiative) {
    id
    name
    initiative
  }
}
`;

function Character({ name, initiative, id }) {
  const [editing, setEdit] = useState(false)
  const [editName, setEditName] = useState(name)
  const [editInit, setEditInit] = useState(initiative)

  const [deleteCharacter, { loading, error }] = useMutation(DELETE_CHARACTER, {
    update(cache, { data: { deleteCharacter } }) {
      if (!deleteCharacter) return; // If deletion failed, do nothing

      cache.modify({
        fields: {
          characters(existingCharacters = [], { readField }) {
            return existingCharacters.filter(
              (characterRef) => readField('id', characterRef) !== id
            );
          }
        }
      });
    }
  });

  const [updateCharacter, { error: updateError }] = useMutation(UPDATE_CHARACTER, {
    update(cache, { data: { updateCharacter } }) {
      cache.modify({
        fields: {
          characters(existingCharacters = [], { readField }) {
            return existingCharacters.map((characterRef) =>
              readField('id', characterRef) === updateCharacter.id
                ? { ...characterRef, ...updateCharacter }
                : characterRef
            );
          }
        }
      });
    }
  });

  return (
    <div className="Character">
      {editing ? (
        <input
          className="name"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
      ) : (
        <p className="name">{name}</p>
      )}
  
      {editing ? (
        <>
          <span>Init: </span>
          <input
            className="initiative"
            type="number"  // Ensure numeric input
            value={editInit}
            onChange={(e) => setEditInit(e.target.value)}
          />
        </>
      ) : (
        <p className="initiative">Init: {initiative}</p>
      )}
  
      <button
        onClick={() => {
          deleteCharacter({ variables: { deleteCharacterId: id } });
        }}
        disabled={loading}
      >
        {loading ? "..." : "X"}
      </button>
      {error && <p className="error">Error deleting character</p>}
  
      <button
        onClick={() => {
          if (editing) {
            updateCharacter({
              variables: {
                id: id, // Use correct variable names
                name: editName,
                initiative: parseInt(editInit, 10) // Ensure initiative is an integer
              }
            });
            setEdit(false);
          } else {
            setEdit(true);
          }
        }}
      >
        {editing ? "Save" : "Edit"}
      </button>
  
      {updateError && <p className="error">Error updating character</p>}
    </div>
  );
}

export default Character;
