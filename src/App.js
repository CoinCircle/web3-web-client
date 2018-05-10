import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import Web3 from 'web3';

import './App.css';

class App extends Component {
  state = {
    value: '',
    output: [],
    history: [],
    historyIndex: 0,
  };

  componentDidMount = () => {
    window.web3 = new Web3(new Web3.providers.HttpProvider('https://ethrpc.coincircle.com'));
  }

  handleChange = ({ target: { value } }) => this.setState({ value });

  handleKeyPress = async ({ key }) => {
    const { output, value, history, historyIndex } = this.state;
    let outputProcessed = output.concat(
      <strong className="cmd">
        <FontAwesome name="angle-right" />&nbsp;{value}
      </strong>
    );

    if (key.includes('Enter')) {
      console.log(value)
      if (value === 'clear' || value === 'exit') {
        outputProcessed = [];
      } else if (value.includes('web3')) {
        var results = []
        results[0] = eval(value) /* eslint no-eval: "off" */

        const resultsComponent = results.length && (
          <span className="folders">
            {results.map((el, index) => (
              <span className="folder" key={index}>{el}</span>
            ))}
          </span>
        );

        outputProcessed = outputProcessed.concat(resultsComponent || []);
      } else {
        outputProcessed = outputProcessed.concat(
          <span className="err">
            [error] command not found: {value.split(' ')[0]}
          </span>
        );
      }

      await this.setState({
        value: '',
        output: (outputProcessed || output),
        history: history.concat(value),
      });
      this.setState({ historyIndex: this.state.history.length - 1 });
    } else if (key.includes('ArrowUp')) {
      if (history[historyIndex - 1]) {
        this.setState({
          value: history[historyIndex - 1],
          historyIndex: historyIndex - 1,
        });
      }
    } else if (key.includes('ArrowDown')) {
      if (history[historyIndex + 1]) {
        this.setState({
          value: history[historyIndex + 1],
          historyIndex: historyIndex + 1,
        });
      }
    }
  };

  render() {
    const { value, output } = this.state;

    return (
      <div className="app">
        <h1><FontAwesome name="terminal" className="icon" /> CoinCircle&#39;s Web3<span> web client</span></h1>
        <h2>Simple terminal made to interact with web3</h2>

        <div className="content">
          <div className="terminal">
            <div className="output">
              {output.map((line, index) => <p key={index}>{line}</p>)}
            </div>
            <div className="input">
              <FontAwesome name="angle-right" className="icon" />
              <input
                autoFocus
                value={value}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyPress}
              />
            </div>
          </div>
        </div>
        <footer>forked from <a href="https://github.com/hqro/Terminal-JS" target="_blank">github.com&#47;hqro&#47;Terminal&#45;JS</a></footer>
      </div>
    );
  }
}

export default App;
