import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { LineChart } from 'react-chartkick'
import 'chart.js'



function App() {

  const [tableData, setTableData] = useState([])
  const [gamesGraphData, setGamesGraphData] = useState({})
  const [pointsGraphData, setPointsGraphData] = useState({})

  useEffect(()=>{
    axios.get('https://ping-pong-score.herokuapp.com/get_score/')
    .then(res => setTableData(res.data))
    .catch()

    axios.get('https://ping-pong-score.herokuapp.com/get_graph_data/')
    .then((res) => {
      let gamesData = [
        {
        "name":"Vibhu", "data":res.data.vibhu_games_graph,
        },
        {
        "name":"Dad", "data":res.data.dad_games_graph,
        },
    ]
      let pointsData = [
        {
        "name":"Vibhu", "data":res.data.vibhu_points_graph,
        },
        {
        "name":"Dad", "data":res.data.dad_points_graph,
        },
    ]
      setGamesGraphData(gamesData)
      setPointsGraphData(pointsData)
  })
    .catch()


  },[])

  return (
    <div className="App">
    <h5>Ping Pong Scores</h5>
    { Object.keys(tableData).length ?
      <Table style={{"minWidth":"350px","width":"50%"}}striped bordered hover>
      <thead>
        <tr>
          <th>Score Type</th>
          <th>Vibhu</th>
          <th>Dad</th>
          <th>draw</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Sessions Won</td>
          <td>{tableData.vibhu_session_wins}</td>
          <td>{tableData.dad_session_wins}</td>
          <td>{tableData.draw_session}</td>
        </tr>
        <tr>
          <td>Games Won</td>
          <td>{tableData.vibhu_game_wins}</td>
          <td>{tableData.dad_game_wins}</td>
          <td>N/A</td>
        </tr>
        <tr>
          <td>Points Won</td>
          <td>{tableData.total_vibhu_points}</td>
          <td>{tableData.total_dad_points}</td>
          <td>N/A</td>
        </tr>
      </tbody>
      </Table>
    : "Loading Data"}
    <LineChart legend={false} ytitle="Games won"  data={gamesGraphData} />
    <LineChart ytitle="Points won" legend="bottom" data={pointsGraphData} />
    </div>
  );
}

export default App;
