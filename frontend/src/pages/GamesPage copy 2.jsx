import React, { useState, useEffect } from "react";
import { apiGetAllGames } from "../services/apiService";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Header from "../components/Header";
import Main from "../components/Main";
import Games from "../components/Games";
import Game from "../components/Game";

export default function FlashCardsPage() {
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  let mainJsx = (
    <div className="flex justify-center my-4">
      <Loading />
    </div>
  );

  if (error) {
    mainJsx = <Error>{error}</Error>;
  }

  if (!loading && !error) {
    const teamStats = {};

    allGames.forEach(({ partidas }) => {
      partidas.forEach((partida) => {
        const { mandante, visitante, placar_mandante, placar_visitante } =
          partida;
        if (!teamStats[mandante]) {
          teamStats[mandante] = { vitorias: 0, derrotas: 0 };
        }
        if (!teamStats[visitante]) {
          teamStats[visitante] = { vitorias: 0, derrotas: 0 };
        }

        if (placar_mandante > placar_visitante) {
          teamStats[mandante].vitorias++;
          teamStats[visitante].derrotas++;
        } else if (placar_mandante < placar_visitante) {
          teamStats[visitante].vitorias++;
          teamStats[mandante].derrotas++;
        }
      });
    });

    mainJsx = (
      <>
        <div className="text-center text-lg m-2 font-bold">
          -----------------------------------------------------
          <Games allGames={allGames} teamStats={teamStats} />
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