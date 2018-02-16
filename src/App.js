import React, { Component } from "react";
import Frontpage from "./Frontpage.js";
import Payments from "./Payments.js";
import Neighbors from "./Neighbors.js";

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
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Althea</h1>
        </header>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 750
            }}
          >
            <Page hash={this.state.hash} />
          </div>
        </div>
      </div>
    );
  }
}

function Page({ hash, changePage }) {
  switch (hash) {
    case "wifi-settings":
      return <div>wifi settings</div>;
    case "payments":
      return <Payments />;
    case "neighbors":
      return <Neighbors />;
    default:
      return <Frontpage changePage={changePage} />;
  }
}

export default App;
