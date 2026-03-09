import { useEffect, useState } from "react"
import axios from "axios"

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    axios.get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
      .then(res => {
        const data = res.data[0]
        setCountry({
          found: true,
          data: {
            name: data.name.common,
            capital: data.capital ? data.capital[0] : 'N/A',
            population: data.population,
            flag: data.flags.svg
          }
        })
      })
      .catch(err => {
        setCountry({ found: false })
      })
  }, [name])

  return country
}