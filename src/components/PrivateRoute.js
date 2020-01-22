import React from "react";
import { navigate } from "gatsby";
import { isLoggedIn } from "../services/auth";

export default class PrivateRoute extends React.Component {
  componentDidMount() {
    const { location } = this.props;
    if (!isLoggedIn() && location.pathname !== `/missyandphil/login`) {
      navigate("/missyandphil/login");
    }
  }

  render() {
    const { component: Component, location, ...rest } = this.props;
    if (!isLoggedIn() && location.pathname !== `/missyandphil/login`) {
      return null;
    }
    return <Component {...rest} />;
  }
}
