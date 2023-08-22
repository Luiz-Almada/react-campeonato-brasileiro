import React, { useState, useEffect } from "react";
import { apiGetAllGames } from "../services/apiService";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Header from "../components/Header";
import Main from "../components/Main";
import Games from "../components/Games";

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
          teamStats[mandante] = {
            vitorias: 0,
            empates: 0,
            derrotas: 0,
            total_pontos: 0,
            gols_pro: 0,
            gols_contra: 0,
            saldo_gols: 0,
          };
        }
        if (!teamStats[visitante]) {
          teamStats[visitante] = {
            vitorias: 0,
            empates: 0,
            derrotas: 0,
            total_pontos: 0,
            gols_pro: 0,
            gols_contra: 0,
            saldo_gols: 0,
          };
        }

        if (placar_mandante > placar_visitante) {
          teamStats[mandante].vitorias++;
          teamStats[mandante].total_pontos += 3;
          teamStats[mandante].gols_pro += placar_mandante;
          teamStats[mandante].gols_contra += placar_visitante;
          teamStats[mandante].saldo_gols += placar_mandante - placar_visitante;

          teamStats[visitante].derrotas++;
          teamStats[visitante].gols_pro += placar_visitante;
          teamStats[visitante].gols_contra += placar_mandante;
          teamStats[visitante].saldo_gols += placar_visitante - placar_mandante;
        } else if (placar_mandante < placar_visitante) {
          teamStats[visitante].vitorias++;
          teamStats[visitante].total_pontos += 3;
          teamStats[visitante].gols_pro += placar_visitante;
          teamStats[visitante].gols_contra += placar_mandante;
          teamStats[visitante].saldo_gols += placar_visitante - placar_mandante;

          teamStats[mandante].derrotas++;
          teamStats[mandante].gols_pro += placar_mandante;
          teamStats[mandante].gols_contra += placar_visitante;
          teamStats[mandante].saldo_gols += placar_mandante - placar_visitante;
        } else {
          teamStats[mandante].empates++;
          teamStats[mandante].total_pontos += 1;
          teamStats[mandante].gols_pro += placar_mandante;
          teamStats[mandante].gols_contra += placar_visitante;

          teamStats[visitante].empates++;
          teamStats[visitante].total_pontos += 1;
          teamStats[visitante].gols_pro += placar_visitante;
          teamStats[visitante].gols_contra += placar_mandante;
        }
      });
    });

    const teamStatsArray = Object.entries(teamStats).map(
      ([teamName, stats]) => ({
        teamName,
        ...stats,
      })
    );

    teamStatsArray.sort((a, b) => {
      if (b.total_pontos !== a.total_pontos) {
        return b.total_pontos - a.total_pontos;
      } else if (b.vitorias !== a.vitorias) {
        return b.vitorias - a.vitorias;
      } else {
        return b.saldo_gols - a.saldo_gols;
      }
    });

    mainJsx = (
      <div className="text-center text-lg m-2 font-bold">
        <Games year={selectedYear} teamStats={teamStatsArray} />
      </div>
    );
  }

  const years = [];
  for (let year = 2003; year <= 2015; year++) {
    years.push(year);
  }

  return (
    <>
      <Header className="text-center">react-campeonato-brasileiro</Header>
      <br></br>
      <div className="flex justify-center items-center px-4">
        <button
          className="bg-white-200 hover:bg-blue-200 text-black font-bold py-0 px-3 rounded"
          onClick={() => setSelectedYear(selectedYear - 1)}
          disabled={selectedYear === 2003}
        >
          &lt;
        </button>
        <select
          id="selectYear"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="shadow-lg mx-3 block"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          className="bg-white-200 hover:bg-blue-200 text-black font-bold py-0 px-3 rounded"
          onClick={() => setSelectedYear(selectedYear + 1)}
          disabled={selectedYear === 2015}
        >
          &gt;
        </button>
      </div>

      <Main className="text-center">{mainJsx}</Main>
    </>
  );
}
