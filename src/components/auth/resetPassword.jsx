import React, { Component } from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as commonFunctions from '../utilities/commonFunctions';
import _ from 'lodash';
import $ from 'jquery';
import { loader } from "graphql.macro";
const UPDATE_FORGOT_PASSWORD = loader('../../graphql/auth/updateForgotPassword.graphql');

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      error: null,
      token: '',
      email: '',
      password: '',
      confirmPassword: '',
      hasError: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    $("#loadingDiv").show();
    if (!_.isEmpty(this.props.match.params.token)) {
      const token = commonFunctions.getUrlValue(this.props.match.params.token);
      this.setState({ token: token });
      setTimeout(() => {
        $("#loadingDiv").hide();
      }, 500);
    } else {
      this.props.history.push('/');
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // Function to validate
  validateForm() {
    let errors = {};
    let formIsValid = true;
    let {
      email,
      password,
      confirmPassword,
    } = this.state;

    //Email
    if (!email) {
      formIsValid = false;
      errors["email"] = "Please enter your email address.";
    }

    if (email !== "" && !commonFunctions.validateEmail(email)) {
      formIsValid = false;
      errors["email"] = "Please enter a valid email address.";
    }

    // Password
    if (!password) {
      formIsValid = false;
      errors["password"] = "Please enter your password.";
    }

    if (password && password.length < 8) {
      formIsValid = false;
      errors["password"] = "password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      formIsValid = false;
      errors["confirmPassword"] = "Please enter your confirmation password.";
    }

    if (confirmPassword && confirmPassword !== password) {
      formIsValid = false;
      errors["confirmPassword"] = "Password and confirmation password does not match.";
    }

    this.setState({ hasError: errors });
    return formIsValid;
  }

  /**Update forgot password */
  updatePassword(e) {
    e.preventDefault();
    let { email, password, confirmPassword, token } = this.state;
    let errors = {};
    if (this.validateForm()) {
      $("#loadingDiv").show();
      this.props.client.mutate({
        mutation: UPDATE_FORGOT_PASSWORD,
        variables: {
          "email": email,
          "token": token,
          "password": password,
          "password_confirmation": confirmPassword
        }
      }).then(response => {
        if (response.data.updateForgottenPassword.status === 'EMAIL_NOT_SENT') {
          errors['error'] = response.data.updateForgottenPassword.message;
          this.setState({ hasError: errors });
          $("#loadingDiv").hide();
        } else if (response.data.updateForgottenPassword.status === 'PASSWORD_NOT_UPDATED') {
          errors['error'] = response.data.updateForgottenPassword.message;
          this.setState({ hasError: errors });
          $("#loadingDiv").hide();
        } else {
          this.setState({ success: response.data.updateForgottenPassword.message });
          setTimeout(() => {
            this.props.history.push('/');
          }, 5000);
          $("#loadingDiv").hide();
        }

      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        errors['error'] = errorMsg;
        this.setState({ hasError: errors });
        $("#loadingDiv").hide();
      });
    }
  }

  redirectHome(e) {
    e.preventDefault();
    this.props.history.push('/');
  }

  render() {
    let { email, password, confirmPassword, hasError, success } = this.state;
    return (
      <React.Fragment>
        <div id="updatePassword" className="row">
          <div className="col-md-3 left_info">
          </div>
          <div className="col-md-9 right_info">
            <div className="card-1">
              <div className="card-body">
                <form className="form" autoComplete="off" onSubmit={(e) => this.updatePassword(e)}>
                  <div className="card-header-1">
                    <h3 className="mb-0 text-center">Change Password</h3>
                    {hasError.error && (
                      <div className="error-msg text-center">
                        {hasError.error}
                      </div>
                    )}
                    {success && (
                      <div className="success-msg text-success text-center">
                        {success}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputPasswordOld">Email</label>
                    <input
                      type="text"
                      name="email"
                      className="form-control"
                      id="inputPassword"
                      value={email}
                      onChange={this.handleChange}
                    />
                    <div className='invalid-feedback'>{hasError.email}</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputPasswordOld">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="inputPassword"
                      value={password}
                      onChange={this.handleChange}
                    />
                    <div className='invalid-feedback'>{hasError.password}</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputPasswordNew">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      id="inputPassword"
                      value={confirmPassword}
                      onChange={this.handleChange}
                    />
                    <div className='invalid-feedback'>{hasError.confirmPassword}</div>
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary update-pswd">Update Password</button>
                  </div>
                  <a href="#/" onClick={(e) => this.redirectHome(e)} className="redirect-home text-center">Home</a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment >
    )
  }
}

const enhance = compose(
  withRouter,
  withApollo
);

export default enhance(ResetPassword);