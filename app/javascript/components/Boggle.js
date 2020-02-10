
import React from "react"
import PropTypes from "prop-types"

function Square(props) {
  const buttonStyle = {
    background: '#f8f0f0'
  };

  if(selectHistory[props.index] == 0)
  {
    buttonStyle.background = '#f8f0f0';
  }
  else
  {
    buttonStyle.background = 'blue';
  }

  return (
    <button className="square" style={buttonStyle} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class WordList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div className="error-message">
        <p>{this.props.value}</p>
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0, minutes: 0 };
  }

  tick() {
    this.setState(state => ({
      seconds: state.seconds + 1
    }));

    if(this.state.seconds == 60)
    {
      this.setState(state => ({
        seconds: 0,
        minutes: state.minutes + 1
      }))

      if(this.state.minutes == 2)
      {
        clearInterval(this.interval);
        gameOn = 0;
      }
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        Timer : {this.state.minutes} minutes {this.state.seconds} seconds
      </div>
    );
  }
}

let letters = [];
let adjacent = [];
let history = [];
let selectHistory = Array(16).fill(0);
let gameOn = 1;

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  async componentDidMount() {
    const response = await fetch('v1/boggle/board');
    const result = await response.json();
    this.setState({
      data: result.data
    })
    letters = result.data;
    adjacent = result.adjacent;
  }

  renderSquare(i) {
    return <Square value={this.state.data[i]} index= {i} onClick={() => this.props.onClick(i)}/>;
  }

  render() {
    return (
      <div>
        <div className="status">Boggle Game</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
        </div>
        <div className="board-row">
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
        </div>
        <div className="board-row">
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare(10)}
          {this.renderSquare(11)}
        </div>
        <div className="board-row">
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
          {this.renderSquare(15)}
        </div>
      </div>
    );
  }
}

class Boggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: '',
      validWord:[],
      score:0,
      message: ''
    };
  }

  handleClick(i) {
    const word = this.state.word;
    const previous = history[history.length - 1];

    if(gameOn == 0)
    {
      return;
    }

    if(history.length == 0)
    {
      this.setState({
        word: word.concat(letters[i]),
        message: ''
      });
      history.push(i);
      selectHistory[i] = 1;
    }
    else
    {
      if(i == previous)
      {
        this.setState({
          word: word.substring(0, word.length - letters[i].length),
          message: ''
        });
        history = history.slice(0, history.length - 1);
        selectHistory[i] = 0;
      }
      else
      {
        if(adjacent[previous].indexOf(i) > -1)
        {
          if(history.indexOf(i) == -1 )
          {
            this.setState({
              word: word.concat(letters[i]),
              message: ''
            });
            history.push(i);
            selectHistory[i] = 1;
          }
        }
        else{
          this.setState({
            message: 'Only adjacent key can be pressed.'
          });
        }
      }
    }
  }

  async SubmitWord()
  {
    selectHistory = selectHistory.fill(0);
    history = [];
    
    if(gameOn == 0)
    {
      this.setState({
        word: '',
        message: ''
      });
      return;
    }

    if(this.state.validWord && this.state.validWord.indexOf(this.state.word) > -1)
    {
      this.setState({
        word: '',
        message: 'word already added.'
      });
      return;
    }

    const response = await fetch('v1/boggle/evaluate?word=' + this.state.word);
    const result = await response.json();

    if(result.valid == true)
    {
      this.setState(state => ({
        word: '',
        validWord: state.validWord.concat(state.word),
        score: state.score + state.word.length,
        message: 'word added.'
      }));
    }
    else
    {
      this.setState({
        word: '',
        message: 'word is invalid.'
      });
    }
  }


  render() {
    const word = this.state.word;
    const validWords = this.state.validWord;
    return (
      <div className="game">
        <div className="game-board">
        <Board
            onClick={i => this.handleClick(i)}
          />
          <div className="game-submit">
          <div><input id="txtBox"
            type="text"
            value={word} readOnly/>
            <button onClick={() => this.SubmitWord(word)}>Submit</button></div>
          </div>
          <Message value={this.state.message}/>
        </div>
        <div className="game-info">
          <div><Timer/></div>
          <ol>Words : <WordList items={validWords}/></ol>
          <ol>Score: {this.state.score}</ol>
        </div>
      </div>
    );
  }
}

export default Boggle
