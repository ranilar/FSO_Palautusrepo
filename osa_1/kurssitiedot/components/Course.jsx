const Course = (props) => {
  return (
    <div>
      {props.course.map(course => (
        <div key={course.id}>
          <Header course={course} />
          <Content course={course.parts} />
          <Total course={course.parts} />
        </div>
      ))}
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.parts.name} {props.parts.exercises}</p>
    </div>
  )
}

const Header = (props) => {
  return (
    <div>
      <h2>{props.course.name}</h2>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      {props.course.map(part => 
      <Part key={part.id} parts={part}/>
      )}
    </div>
  )
}

const Total = (props) => {
  const total = props.course.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      Total exercises: {total}
    </div>
  )
}

export default Course