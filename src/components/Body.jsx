import React,{useState,useEffect} from 'react'
import {AiOutlineSearch} from "react-icons/ai"
import {BsFillCloudsFill,BsGithub} from "react-icons/bs"
import L from "country-js"
import {getNames} from "country-list"
import axios from "axios"
import "../App.css"
import { motion,animate } from 'framer-motion'
           
export default function Body() {
  const [country, setCountry] = useState("Nigeria")
  const [humidity, setHumidity] = useState("66")
  const [temprature, setTemperature]= useState("14.6")
  const [wind, setWind] = useState("2.6")
  const [cloud, setCloud] = useState("Broken Clouds")
  const [latitude, setLatitude] = useState("9.081999")
  const [longitude, setLongitude] = useState("8.675277")
  const [summary, setSummary] = useState("")
  const [isCountry, setIsCountry] = useState(true)

  const changeVal=(event)=> {setCountry(event.target.value)}

  useEffect(() => {
    getForcast(country)
  },[])


  async function getForcast(selectedCountry) {
    const Country = selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1)
    if(getNames().find(name => name === Country) != undefined) {

      //=======================GET=CORDINATES========================
      const countryName =  L.search(Country)
      const Latitude = countryName[0].geo.latitude
      const Longitude = countryName[0].geo.longitude
      setLatitude(Latitude.toString())
      setLongitude(Longitude.toString())

                
    const options = {
      method: 'GET',
      url: 'https://ai-weather-by-meteosource.p.rapidapi.com/daily',
      params: {
        lat: latitude,
        lon: longitude,
        language: 'en',
        units: 'auto'
      },
      headers: {
        'X-RapidAPI-Key': '5e5017208dmsh09b11f6586e22d7p195d82jsnf2baa651bab7',
        'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com'
      }
    };
      
      try {
        setIsCountry(true)
        const response = await axios.request(options);
        const daily = response.data.daily.data[0]
        setTemperature(daily.temperature)
        setSummary(daily.summary)
        setHumidity(daily.humidity)
        setWind(daily.wind.speed)
        setCloud(daily.weather)
        console.log(response.data)
      }
      catch(error) {
        console.error(error)
      }
    } else {
      setIsCountry(false)
    }
}

  return (
    <div className='containerContain'>
      <motion.div 
      className='container'>
        <div className='inputDiv'>
        <input type="text" className='Input' placeholder='Search' value={country} onChange={changeVal}/>
        <AiOutlineSearch onClick={() => getForcast(country)} className='searchIcon'/>
        </div>
        {!isCountry ? <motion.div 
         animate={{ y:10}}
         transition={{ ease: "easeIn", duration: 1 }}
         className="notExist"> invalid country! </motion.div> : <></>}
        <p className='country'>Current Weather in <p className='countryText'>{country}</p></p>
        <p className='summary'>{summary}</p>
        <div className='mainCloudDiv'>
          <div className='leftCloud'>
          <p className='degree'>{temprature}C</p>
              <div className='cloudsDiv'>
                <BsFillCloudsFill className='cloudIcon'/> <p className='cloudType'>{cloud}</p>
                </div>
              </div>
              <div className='rightCloud'>
            <p className='humidity'>Humidity: {humidity}%</p>
            <p className='wind'>Wind: {wind}km/h</p>
            <div className='links'>
            <p className='github'><a><BsGithub/></a></p>
            </div>
          </div>
          </div> 
        </motion.div>
    </div>
  )

}
