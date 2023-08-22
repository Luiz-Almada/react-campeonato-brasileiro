import React from "react";
import "./Games.css"; 

function Games({year, teamStats }) {
  return (
    <div>
      <p>Campeonato Brasileiro de {year}</p>
      <table className="mx-auto w-full">
        <caption>Classificação</caption>
        <thead>
          <tr>
            <th></th>
            <th>Time</th>
            <th>P</th>
            <th>V</th>
            <th>E</th>
            <th>D</th>
            <th>GP</th>
            <th>GC</th>
            <th>SG</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(teamStats).map((time, index) => (
            <tr key={time} className={index % 2 === 0 ? "table-row-even" : ""}>
              <td>{time}</td>
              <td>{teamStats[time].teamName}</td>
              <td>{teamStats[time].total_pontos}</td>
              <td>{teamStats[time].vitorias}</td>
              <td>{teamStats[time].empates}</td>
              <td>{teamStats[time].derrotas}</td>
              <td>{teamStats[time].gols_pro}</td>
              <td>{teamStats[time].gols_contra}</td>
              <td>{teamStats[time].saldo_gols}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <i>
        Legenda: P: pontos, V: vitórias, E: empates, D: derrotas, GP: gols pró, GC: gols contra, SG: saldo de gols.
      </i>
    </div>
  );
}

export default Games;
