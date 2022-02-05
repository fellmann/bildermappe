import useChoreoStore from "../../store/useChoreoStore"
import { Person } from "./Person"

export function Persons() {
  const persons = useChoreoStore((state) => state.choreo.persons)
  const ret = []

  for (let i = 0; i < persons; i++) {
    ret.push(<Person id={i * 2} key={i * 2} />)
    ret.push(<Person id={i * 2 + 1} key={i * 2 + 1} />)
  }
  return <>{ret}</>
}
