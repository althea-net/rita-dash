import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Frontpage from "./Frontpage.js";
import { Button } from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: "home"
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Althea</h1>
        </header>
        <Page hash={this.state.hash} />
      </div>
    );
  }
}

function Page({ hash }) {
  switch (hash) {
    case "home":
      return <Frontpage />;
    // case "wifi":
    //   return <WifiSettings />;
    // case "connections":
    //   return <Connections />;
    // default:
    //   return <Frontpage />;
  }
}

export default App;
