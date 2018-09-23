import React from 'react';
import axios from 'axios'
import personService from './services/persons' 
import './index.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="infoMessage">
      {message}
    </div>
  )
}

const InfoInput = (props) => {
  return (
    <div>
       <h2>Lisää uusi</h2>
        <form onSubmit={props.addPhoneNumber}>
          <div>
            nimi: <input 
                  value={props.state.newName}
                  onChange={props.handleNameInputChange}
                  />
          </div>
          <div>
            numero: <input 
                    value={props.state.newNumber}
                    onChange={props.handlePhoneNumberChange}
                    />
          </div>
          <div>
            <button type="submit">lisää</button>
          </div>
        </form>
    </div>
  )
}

const PersonalInfo = (props) => {
  return (
    <div>
        <li>{props.name} {props.number} <button onClick={props.removeNameCallBack}>poista</button></li>
        
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [
        
      ],
      infoMessage: null,
      newName: '',
      newNumber: '',
      filterValue: '',
      personsToShow: [
        
      ]
    }
  }

  componentDidMount() {
    console.log('did mount')
    personService
      .getAll()
      .then(persons =>  {
        this.setState({ personsToShow: persons,
                        persons: persons}
        )}
      )
      
  }


  handleFilterInputChange = (event) => {
       
    const filteredPersons = this.state.persons.filter(p => p.name.toLowerCase().split(" ")[0] === event.target.value.toLowerCase() ||
                                                         p.name.toLowerCase().split(" ")[1] === event.target.value.toLowerCase()   
                                                    )
    
    if (filteredPersons.length > 0)
    {
      this.setState({ personsToShow: filteredPersons })
    } else
    {
      this.setState({ personsToShow: this.state.persons })
    }
    console.log("Filtered person:", filteredPersons)
    console.log("Unfiltered:", this.state.persons)
    this.setState({ filterValue: event.target.value })
  }

  handlePhoneNumberChange = (event) => {
    console.log(event.target.value)
    this.setState({ newNumber: event.target.value })
  }

  handleNameInputChange = (event) => {
    console.log(event.target.value)
    this.setState({ newName: event.target.value })
  }

  addPhoneNumber = (event) => {
    
    event.preventDefault()
    if(this.state.persons.find(p => p.name === this.state.newName))
    {
      const str = "Korvataanko henkilön "+ this.state.newName +" "+"numero uudella?"
      console.log(this.state.newName)
      const result = window.confirm(str)
      if (!result)
      {
        return
      }
      const updatedPersonObject = {
        number: this.state.newNumber,
        name: this.state.newName
      }  
      const person = this.state.persons.find(p => p.name === this.state.newName)
      personService
        .update(person.id, updatedPersonObject)
        .then(resp => {
          personService
            .getAll()
            .then(persons => 
              this.setState({
                infoMessage: "Number updated!",
                persons: persons},
                () => this.handleFilterInputChange({target: {value: this.state.filterValue}})
              )
            )
        })
        .catch( error => {
           // Person to pe updated is missing. Add again. 
           personService
           .create(updatedPersonObject)
           .then(addedPerson => {
             this.setState({
               persons: this.state.persons.concat(addedPerson)},
               () => this.handleFilterInputChange({target: {value: this.state.filterValue}})
             )
           })
          }
        )
      return
    }
    
    // Person to add
    const personObject = {
      name: this.state.newName,
      number: this.state.newNumber
    }
    personService
      .create(personObject)
      .then(addedPerson => {
        this.setState({
          infoMessage: "Person added!",
          persons: this.state.persons.concat(addedPerson)},
          () => this.handleFilterInputChange({target: {value: this.state.filterValue}})
        )
      })
  }

  removeNameCallBack = (id,name) =>
  {
    const str = "Poistetaanko tiedot? ("+ name +")"
    const result = window.confirm(str)
    if (!result)
    {
      return
    }
    personService
      .remove(id)
      .then(resp => {
        personService
          .getAll()
          .then(persons => 
            this.setState({
              infoMessage: "Person removed!",
              persons: persons},
              () => this.handleFilterInputChange({target: {value: this.state.filterValue}})
            )
          )
      })
      .catch(error => console.log(error))
  }

  render() {
    return (
      <div>
        {<Notification message={this.state.infoMessage}/>}
        <h1>Puhelinluettelo</h1>
        <div>
          rajaa näytettäviä:<input 
                            value={this.state.filterValue}
                            onChange={this.handleFilterInputChange}
                            />
        </div>
        <InfoInput state={this.state} 
                   handlePhoneNumberChange={this.handlePhoneNumberChange}
                   handleNameInputChange={this.handleNameInputChange}
                   addPhoneNumber={this.addPhoneNumber}
                  />
        <h2>Numerot</h2>
        
        {this.state.personsToShow.map(p => <PersonalInfo 
                                              key={p.name} 
                                              name={p.name} 
                                              number={p.number}
                                              removeNameCallBack={() => this.removeNameCallBack(p.id, p.name)}/> 
                                      )}
      </div>
    )
  }
}

export default App