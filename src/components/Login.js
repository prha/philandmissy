import React from "react";
import { navigate } from "gatsby";
import { handleLogin, isLoggedIn } from "../services/auth";

class Login extends React.Component {
  state = {
    password: ``,
    error: false
  };

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (handleLogin(this.state)) {
      navigate(`/`);
    }
    this.setState({ error: true });
  };

  render() {
    const { error } = this.state;
    if (isLoggedIn()) {
      navigate(`/`);
    }

    return (
      <div className="row loginContainer">
        <div className="column login">
          <div className="column">
            <div className="title">
              <div className="part">Missy</div>
              <div className="part">&</div>
              <div className="part">Phil's</div>
            </div>
            <div className="subtitle">Private Wedding Website</div>
            <form method="post" onSubmit={this.handleSubmit}>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                onChange={this.handleUpdate}
              />
              <div />
              {error && <div className="error">Incorrect Password</div>}
              <button className="submit" type="submit">
                <div className="frame1" />
                <div className="frame2" />
                Enter
              </button>
            </form>
          </div>
          <div />
        </div>
      </div>
    );
  }
}

export default Login;
