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
 
  const [currentSession, setCurrentSession] = useState({})
  const [vibhuScore, setVibhuScore] = useState(0)
  const [dadScore, setDadScore] = useState(0)
  const [apiKey, setApiKey] = useState('')

const getScore = () =>{
  axios.get('https://ping-pong-score.herokuapp.com/get_score/')
  // axios.get('http://127.0.0.1:8000/get_score/')
  .then(res => setTableData(res.data))
  .catch()
}

const getGraphData = () =>{
  axios.get('https://ping-pong-score.herokuapp.com/get_graph_data/')
  // axios.get('http://127.0.0.1:8000/get_graph_data/')
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
}
const getCurrentSession = () =>{
  // axios.get('https://ping-pong-score.herokuapp.com/get_graph_data/')
  axios.get('https://ping-pong-score.herokuapp.com/get_current_session/')
  .then(res => {
    setCurrentSession(res.data)
  })
  .catch()
}

  useEffect(()=>{
    getScore()
    getGraphData()
    getCurrentSession()
  },[])



  const createNewSession = () =>{
    let makeSession = window.confirm('are you sure?')
    if (makeSession) {
      let data = {
        date: new Date().toISOString().slice(0,10)
      }
      axios.post(`https://ping-pong-score.herokuapp.com/session/?apiKey=${apiKey}`, data)
      .then((res) => {
        setCurrentSession(res.data)

        getScore()
        getGraphData()
        getCurrentSession()
      })
      .catch(err => alert('please enter the correct api key'))
    }
  }

  const createNewGame = () =>{
    let data = {
      session: currentSession.current_session_id,
      vibhu_score: vibhuScore,
      dad_score: dadScore,
    }
    axios.post(`https://ping-pong-score.herokuapp.com/game/?apiKey=${apiKey}`, data)
    .then((res) => {
      setVibhuScore(0)
      setDadScore(0)

      getScore()
      getGraphData()
      getCurrentSession()
    })
    .catch(err => alert('please enter the correct api key'))
  }

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
      <Table style={{"minWidth":"350px","width":"50%"}}striped bordered hover>
      <thead>
        <tr>
          <th>Current Session</th>
          <th>{currentSession.current_session_date}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Vibhu</td>
          <td>{currentSession.vibhu_score}</td>
        </tr>
        <tr>
          <td>Dad</td>
          <td>{currentSession.dad_score}</td>
        </tr>
        <tr>
        <td colspan="2">New Game</td>
        </tr>
        <tr>
          <td>vibhu score</td>
          <td><input onChange={(e)=>setVibhuScore(e.target.value)} value={vibhuScore} type='number' min="0" ></input></td>
        </tr>
        <tr>
          <td>dad score</td>
          <td><input onChange={(e)=>setDadScore(e.target.value)} value={dadScore} type='number' min="0"></input></td>
        </tr>
        <tr>
          <td>Api Key</td>
          <td><input onChange={(e)=>setApiKey(e.target.value)}></input></td>
          <td><button onClick={createNewGame} >save</button></td>
        </tr>
        <tr>
          <td><button onClick={createNewSession} >Create New Session</button></td>
        </tr>

      </tbody>
      </Table>
    </div>
  );
}

export default App;
