const Person = ({person, handle}) => (
  <tr>
    <td>{person.name}</td>
    <td>{person.number}</td>
    <td><button onClick={handle} id={person.id}>delete</button></td>
  </tr>
)

const Persons = ({persons, filter, handleDelete}) => {
  return (
    <table>
      <tbody>
        {persons
          .filter(person => 
            person.name.toLowerCase().includes(filter.toLowerCase()))
          .map((person) => 
            <Person key={person.id} person={person} handle={handleDelete}/>)
        }
      </tbody>
    </table>
  )
}

export default Persons