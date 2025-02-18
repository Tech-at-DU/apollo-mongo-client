import { useState } from 'react'
// For mutations use useMutation
import { gql, useMutation } from '@apollo/client';
import './AddCharacter.css'

const NEW_CHARACTER = gql`
mutation Create($name: String!, $initiative: Int!) {
  createCharacter(name: $name, initiative: $initiative) {
    name
    initiative
  }
}
`

function AddCharacter() {
  const [ name, setName ] = useState('')
  const [initiative, setInitiative ] = useState(0)

  const [ newCharacter, { loading, error, data } ] = useMutation(NEW_CHARACTER, {
    // Use update cache to refresh components using useQuery after this mutation. 
    update(cache, { data: { createCharacter } }) {
      cache.modify({
        fields: {
          characters(existingCharacters = []) {
            return [...existingCharacters, createCharacter]; // Append new character
          }
        }
      });
    }
  })

  return (
    <>
    <form 
      className="AddCharacter"
      onSubmit={(e) => {
        e.preventDefault()
        newCharacter({ 
          variables: { name, initiative: parseInt(initiative) }
        })
        setName('')
        setInitiative(0)
      }}
    >
      <input 
        value={name}
        placeholder="Enter Name"
        type='text'
        onChange={(e) => setName(e.target.value)}
      />

      <input 
        className="initiative"
        value={initiative}
        type='number'
        placeholder="Init Bonus"
        onChange={(e) => setInitiative(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
    {error && <p className="error">Error: {error.message}</p>}
      {data && <p className="success">Character added: {data.createCharacter.name}</p>}
    </>
  )
}

export default AddCharacter