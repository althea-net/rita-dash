import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Frontpage from "./Frontpage.js";
import { Button } from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: window.location.hash.substr(1)
    };
    this.onHashChange();
    window.addEventListener("hashchange", this.onHashChange, false);
  }

  onHashChange = () => {
    this.setState({
      hash: window.location.hash.substr(1)
    });
  };

  render() {
    // this.onHashChange();
    // window.addEventListener("hashchange", this.onHashChange, false);
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

function Page({ hash, changePage }) {
  switch (hash) {
    case "":
      return <Frontpage changePage={changePage} />;
    case "buy-coins":
      return <div>gonna be rich</div>;
    // case "wifi":
    //   return <WifiSettings />;
    // case "connections":
    //   return <Connections />;
    // default:
    //   return <Frontpage />;
  }
}

export default App;
