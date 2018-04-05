import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
  }

  handleErrors() {
    this.props.clearErrors();
  }

  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state);
    this.props.processForm(user);
  }

  renderErrors() {
    return(
      <ul>
        {this.props.errors.map((error, i) => (
          <li key={`error-${i}`}>
            {error}
          </li>
        ))}
      </ul>
    );
  }

  render() {

    return (

      <div className="modal is-open">
        <form onSubmit={this.handleSubmit} className="login-form-box modal-form">
          <span className="modal-close js-modal-close">&times;</span>
          Please {this.props.formType} or
          <Link to={this.props.linkType} onClick={this.handleErrors}>{this.props.message}</Link>
          <div className="login-form">
            <br/>
            <label>Username:
              <input type="text"
                value={this.state.username}
                onChange={this.update('username')}
                className="login-input"
              />
            </label>
            <br/>
            <label>Password:
              <input type="password"
                value={this.state.password}
                onChange={this.update('password')}
                className="login-input"
              />
            </label>
            <div className="errors">
              {this.renderErrors()}
            </div>
            <br/>
              <input className="session-submit" type="submit" value={this.props.formType} />
              <span className="button-alternative">or <strong className="js-modal-close">Cancel</strong></span>
          </div>
        </form>
        <div className="modal-screen js-modal-close"></div>
      </div>
    );
  }
}

export default withRouter(LoginForm);
