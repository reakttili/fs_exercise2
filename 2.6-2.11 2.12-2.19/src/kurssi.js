import React from 'react'
import ReactDOM from 'react-dom'
const helpCountExcercises = (osat) =>
{
  const reducer = (accumulator, currentValue) => accumulator + currentValue.tehtavia;
  let excerciseAmount = 0;
  excerciseAmount = osat.reduce(reducer,0);
  return excerciseAmount;
}

const Otsikko = (props) => {
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  )
}

const Osa = (props) => {
  return (
    <div>
      <p>{props.osa} {props.tehtava}</p>
    </div>
  )
}

const Sisalto = (props) => {
  return (
    <div>
      {props.osat.map( o => 
        <Osa key={o.id}
             osa={o.nimi} 
             tehtava={o.tehtavia}
        />
      )}
    </div>
  )
}

const Yhteensa = (props) => {
  return (
    <div>
      <p>Yhteensä {helpCountExcercises(props.osat)} tehtävää</p>
    </div>
  )
}

const Kurssi = (props) => {
  return (
    <div>
    <Otsikko name={props.kurssi.nimi} />
    <Sisalto osat={props.kurssi.osat} />
    <Yhteensa osat={props.kurssi.osat}/>
    </div>
  )
}

export default Kurssi