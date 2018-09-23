import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameToFilter: '',
      filteredItems: [],
      bTooMany: false
    }
  }

  componentDidMount() {
    const e = {target:{value:''}}
    this.handleFilterInputChange(e)
  }

  handleFilterInputChange = (event) =>
  {
    console.log(event.target.value)
    // Fetch all countries
    const stringToSearch = event.target.value;
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        let filteredItems = response.data.filter(item => item.name.toLowerCase().search(stringToSearch.toLowerCase()) !== -1)
        let bTooMany = true;
        if (filteredItems.length < 10)
        {
          bTooMany = false
        }
        console.log(response.data)

        this.setState({filteredItems: filteredItems,
                       bTooMany:bTooMany
                      })

      })
      this.setState({nameToFilter:stringToSearch})
  }

  handleCountyNameClick = (countryName) => {
    const e = {target:{value:countryName}}
    this.handleFilterInputChange(e)
  }

  render() {
    let result = null
    if (this.state.nameToFilter.length === 0)
    {
      result = <div></div>
    }
    else if (this.state.bTooMany)
    {
      result = <div>Too many! Specify another filter.</div>
    }
    else if (this.state.filteredItems.length === 1)
    {
      const country = this.state.filteredItems[0]
      console.log(country)
      result = <div>
                  <h1>{country.name}</h1>
                  <div>capital: {country.capital}</div>
                  <div>population: {country.population}</div>
                  <img src={country.flag} height="100" width="200" alt="lippu"></img>
              </div>
    } else // maat pelkästään
    {
      result = this.state.filteredItems.map(item => <div key={item.name} onClick={()=>this.handleCountyNameClick(item.name)} name={item.name}>{item.name}</div>)
    }
    return (
      <div>
         suodata: <input 
                  value={this.state.nameToFilter}
                  onChange={this.handleFilterInputChange}
                  />
          {result}
         
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)