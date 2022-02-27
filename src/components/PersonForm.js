const PersonForm = ({submitHandle, nameValue, nameHandle, numberValue, numberHandle}) => (
  <form onSubmit={submitHandle}>
    <div>
      name: <input value={nameValue} onChange={nameHandle} />
      number: <input value={numberValue} onChange={numberHandle} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

export default PersonForm