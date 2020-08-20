import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  CardContent,
  Card,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(["worldWide"]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  // https://disease.sh/v3/covid-19/countries
  // useEffect = Runs a piece of code based on a given condition.
  useEffect(() => {
    // The [] code inside will run only once when the app component gets load and not again.
    // it also runs when the variable in countries changes.
    // make a async call to server and wait for it to something.
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom,India
            value: country.countryInfo.iso2, // UK, IND, US
          }));

          const sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData); // get all the list of countries.
        });
    };
    getCountriesData(); // This is how we are handling the async calls.
  }, []);

  const onSelectCountry = async (event) => {
    const countryCode = event.target.value;

    // we need to call the funcn on the select of values and displaythem.
    const url =
      countryCode === "worldWide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        //  all the data of country is saved here.
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1> COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={onSelectCountry}
              value={country}
            >
              <MenuItem value="worldWide">worldWide</MenuItem>

              {/* I want to  loop through the countries name and display it in dropdown. */}

              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* // creating the header is completed. */}

        {/* // start to create the status of each country */}

        <div className="app_stats">
          <InfoBox
         
            title="CoronaVirus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
            isRed
            active={(casesType === "cases")}
            onClick={(e) => setCasesType("cases")}
          />
          <InfoBox
         
            title="Recoverd"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
            onClick={(e) => setCasesType("recovered")}
            active={(casesType === "recovered")}
          />
          <InfoBox
           
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
            isRed
            onClick={(e) => setCasesType("deaths")}
            active={(casesType === "deaths")}
          />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app_right">
        {/* /* table to show the data */
        /* graph */}
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3 className="app_graphTitle">WorldWide New {casesType}</h3>
          <LineGraph className="app_graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
