import React, { useRef, useEffect, useState } from 'react';
import ReactMapGL, { Marker, Popup, FullscreenControl, Layer } from "react-map-gl";
import { InfoCircleFill } from 'react-bootstrap-icons';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import mapboxgl from 'mapbox-gl'; 
//@ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
//city and coord data
const data = [
  {
    "id": 1,
    "title": "Lagos",
    "long": 3.3941795,
    "lat": 6.4550575
  },
  {
    "id": 2,
    "title": "Johannesburg",
    "long": 28.0436,
    "lat": -26.2023
  },
  {
    "id": 3,
    "title": "Brussels",
    "long": 4.351697,
    "lat": 50.846557
  },
  {
    "id": 4,
    "title": "Skopje",
    "long": 21.4316495,
    "lat": 41.9960924
  },
  {
    "id": 5,
    "title": "Jakarta",
    "long": 106.827182,
    "lat": -6.1753942
  },
  {
    "id": 6,
    "title": "Accra",
    "long": -0.210767733,
    "lat": 5.585050329
  },
  {
    "id": 7,
    "title": "Riyadh",
    "long": 46.716667,
    "lat": 24.633333
  },
  {
    "id": 8,
    "title": "Istanbul",
    "long": 28.9662187,
    "lat": 41.0091982
  },
  {
    "id": 9,
    "title": "Toronto",
    "long": -79.383935,
    "lat": 43.653482
  },
  {
    "id": 10,
    "title": "London",
    "long": -0.1276473999999997,
    "lat": 51.507321899999994
  },
  {
    "id": 11,
    "title": "Sydney",
    "long": 151.216454,
    "lat": -33.854816
  },
  {
    "id": 12,
    "title": "Paris",
    "long": 2.348915,
    "lat": 48.8534951
  },
  {
    "id": 13,
    "title": "Stockholm",
    "long": 18.071093,
    "lat": 59.325117
  },
  {
    "id": 14,
    "title": "Berlin",
    "long": 13.375368,
    "lat": 52.510242000000005
  },
  {
    "id": 15,
    "title": "Tokyo",
    "long": 139.7263785,
    "lat": 35.6652065
  },
  {
    "id": 16,
    "title": "Seoul",
    "long": 126.9782914,
    "lat": 37.5666791
  },
  {
    "id": 17,
    "title": "Havana",
    "long": -82.3589631,
    "lat": 23.135305
  },
  {
    "id": 18,
    "title": "Miami",
    "long": -80.18537321875,
    "lat": 25.76513515625
  },
  {
    "id": 19,
    "title": "Manchester",
    "long": -2.24462,
    "lat": 53.46684
  },
  {
    "id": 20,
    "title": "Madrid",
    "long": -3.7035825,
    "lat": 40.4167047
  },
]


function App() {
  const [viewport, setViewport] = useState({
    latitude:8.10530640960786,
    longitude: 9.59395988695573,
    zoom: 9,
  });
  const [query, setQuery] = useState('')
  const [cities, setCities] = useState(Object.values(data).map(city => {
    return city;
  }))
  const [list, setList] = useState(cities);
  const handleChange = (e : any) => {
    setQuery(e.target.value)
  }
  const handleSearchClick = (e : any) => {
    if(query === "") { setList(cities); return;}
    const filterBySearch = cities.filter((t, index) => {
      if(t.title.toLowerCase().includes(query.toLowerCase())){
        return t.title;
      }
    })
    setList(filterBySearch);
  }
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [weatherDetail, setWeatherDetail] = useState<Array<void>>([])
  const [locationDetail, setLocationDetail] = useState<string>("")
  const [locations, setLocations] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleMarkerClick = (id, lat, long, ) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };
  const getWeatherDetails = async (locationDetail : any) => {
    setLoading(true);
    const { data } = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${locationDetail}&days=2&units=S&key=6c8216562be042989e85791764ccf4ec`)
    const res = await data;
    setLoading(false);
    return data.data;
  }
  const handleWeatherInfo = async (title : any) => {
    const results =  await getWeatherDetails(title);
    setLocations(results);
  }
  
  return (
    <div style={{ height: "100vh", width: "100%" }}>
        <ReactMapGL
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1IjoiZGVvcm9zMDYiLCJhIjoiY2xmaWU4dThuMDhkdDNvcG5xNTAzc2c1MiJ9.jVQ7dXhkq1hjIsUf6qPjBw"
        width="100%"
        height="100%"
        transitionDuration={200}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onViewportChange={(viewport: any) => setViewport(viewport)}
      >
        <div className="mt">
          <div className='d-flex search__box'>
              <input  type="text" value={query} placeholder="Search a city on the list..." onChange={handleChange} className=""  />
              <button onClick={handleSearchClick} className="btn__search">Search</button>
          </div>
         
          <div className="bg-white mt-xs">
              <p className=''>Select any city</p>        
              <ul className='flex-nav'>       
                {list.map((city: any)=>{
                    return (
                      <li key={city.id} style={{ marginBottom: 8, listStyle:"none"}} onClick={() => {handleMarkerClick(city.id, city.lat, city.long); }}>{city.title}</li>
                    )
                })}
              </ul>                  
          </div>
        </div>
        {data.map(p => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-8 * viewport.zoom}
            >
              <InfoCircleFill style={{
                  fontSize: 5 * viewport.zoom,
                  color: "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => {handleMarkerClick(p.id, p.lat, p.long); setShow(true); handleWeatherInfo(p.title)}} />
              
            </Marker>
           
            {(p.id === currentPlaceId && show) && (
              <Popup
                key={p.id}
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={true}
                onClose={() => {setCurrentPlaceId(null); setShow(false)}}
                anchor="top"
                className='popup__container'
              >
                <div className="card" style={{padding: 10, width: "300px"}}>
                  <label className='weather__label'>Place</label>
                  <h4 className="weather__place">{p.title}</h4>
                  <label className='weather__heading'>Two days forecast</label>
                  <div className='flex'>
                    {(loading ? <Oval
                                height={40}
                                width={40}
                                color="#6A5ACD"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                                ariaLabel='oval-loading'
                                secondaryColor="#6A5ACD"
                                strokeWidth={2}
                                strokeWidthSecondary={2}

                              /> : 
                      (locations.map((i: any, index: number) => {
                      return (
                        <div className='weather__details' key={index}>
                           <div className='weather__day'>{i.datetime}</div>
                           <div className='weather__temp'>{i.max_temp.toFixed(0)}°F</div>
                           <div className='weather__temp'>{i.min_temp.toFixed(0)}°F</div>
                           <div className='weather__image'>
                            <img src={`https://www.weatherbit.io/static/img/icons/${i.weather.icon}.png`} width="40" height="40" />
                           </div>
                           <div className='weather__desc'>{i.weather.description}</div>
                        </div>
                        
                        )
                    })))}
                  </div>
                </div>
              </Popup>
            )}
          
          </>
        ))}
      </ReactMapGL>
    </div>
  );
}

export default App;
