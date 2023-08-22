//import { getNewId } from '../services/idService';
import { useEffect, useState } from "react";

import Error from "../components/Error";
//import ElectionCard from "../components/ElectionCard";
//import ElectionCards from "../components/ElectionCards";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Main from "../components/Main";
import Games from "../components/Games";
//import Item from "../components/Item";

import {
  /* apiGetAllCandidates,
  apiGetAllCities,
  apiGetAllElection,*/
  apiGetAllGames,
} from "../services/apiService";
import Game from "../components/Game";

export default function FlashCardsPage() {
  // Back End
  const [allGames, setAllGames] = useState([]);
  const [allResultGames, setAllResultGames] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Front End
  const [filterYear, setFilterYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2003);

  useEffect(() => {
    async function getAllGames() {
      try {
        const backEndAllGames = await apiGetAllGames(selectedYear);
        setAllGames(backEndAllGames);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        setError(error.message);
      }
    }

    getAllGames();
  }, [selectedYear]);

  /////////////////////////////////////////////
  useEffect(() => {
    function handleFilterYear() {
      let result;

      if (selectedYear && selectedYear.length > 0) {
        result = allGames.filter((item) => item.id === selectedYear);
      } else {
        result = allGames;
      }
      setFilterYear(result[0]);
      // console.log(result[0])
      //console.log(filterCity)
    }

    handleFilterYear();
  }, [allGames, selectedYear]);

  ////////////////////////////////////////////


  let mainJsx = (
    <div className="flex justify-center my-4">
      <Loading />
    </div>
  );

  if (error) {
    mainJsx = <Error>{error}</Error>;
  }

  var key = 1;
  if (!loading && !error) {
    mainJsx = (
      <>
        <div className="text-center text-lg m-2 font-bold">
          -----------------------------------------------------
          <Games allGames={allGames}>
            {allGames.map(({ numero, partidas }) => {
              return <Game key={key++} numero={numero} partidas={partidas} />;
            })}
          </Games>
        </div>
      </>
    );
  }

  const years = [];
  for (let year = 2003; year <= 2015; year++) {
    years.push(year);
  }

  return (
    <>
      <Header>react-campeonato-brasileiro</Header>

      <p>Escolha o ano</p>
      <select
        id="selectYear"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="shadow-lg"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <Main>{mainJsx}</Main>
    </>
  );
}
