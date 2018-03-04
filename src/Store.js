import React, { Component } from "react";

export default class Store extends Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props.initState };

    const setState = this.setState.bind(this);

    this.setters = Object.keys(this.props.setters).reduce((acc, key) => {
      const setter = this.props.setters[key];
      acc[key] = (...args) => {
        const newState = setter(this.state.data)(...args);
        setState({ data: newState });
      };
      return acc;
    }, {});

    this.actions = Object.keys(this.props.actions).reduce((acc, key) => {
      const action = this.props.actions[key];
      acc[key] = (...args) => {
        action(this.setters, () => this.state)(...args);
      };
      return acc;
    }, {});
  }

  render() {
    return React.cloneElement(this.props.children, {
      store: {
        setters: this.setters,
        state: this.state.data,
        actions: this.actions
      }
    });
  }
}
