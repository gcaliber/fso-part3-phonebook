const Filter = ({value, handle}) => (
  <div>
    filter: <input value={value} onChange={handle} />
  </div>
)

export default Filter