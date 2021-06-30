import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import compose from 'recompose/compose';
import * as commonFunctions from '../utilities/commonFunctions';
import { loader } from "graphql.macro";
import ForgotPassword from './forgotPassword';
import $ from 'jquery';
import UserUtils from '../utilities/UserUtils';
import SocialLogin from './socialLogin';
const LOGIN = loader('../../graphql/auth/signin.graphql');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      hasError: {},
      error: null,
      success: null,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      hasError: {}
    });
  }

  openSignUp() {
    document.getElementById("mySidebar").style.width = "400px";
  }

  closeSignIn(e) {
    e.preventDefault();
    document.getElementById("signIn").style.width = "0";
    this.setState({ hasError: {} });
  }

  validateForm() {
    let errors = {};
    let formIsValid = true;
    let { email, password } = this.state;
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

    this.setState({ hasError: errors });
    return formIsValid;
  }

  openSignUpNow(e) {
    e.preventDefault();
    this.closeSignIn(e);
    this.openSignUp();
    this.setState({ hasError: {} });
  }


  handleLogin(e) {
    e.preventDefault();
    let errors = {};
    let { email, password } = this.state;
    if (this.validateForm()) {
      $("#loadingDiv").show();
      this.props.client.mutate({
        mutation: LOGIN,
        variables: {
          "username": email,
          "password": password,
        }
      }).then(response => {
        if (response.data) {
          UserUtils.setAccessToken(response.data.login.access_token);
          UserUtils.setUserID(response.data.login.user.id);
          this.props.history.push('/my-stocks');
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

  forgotPassword(e) {
    e.preventDefault();
    this.closeSignIn(e);
  }

  render() {
    let { email, password, hasError } = this.state;

    return (
      <React.Fragment>
        <div id="signIn" className="sidebar">
          <a href="#/" className="closebtn" onClick={(e) => this.closeSignIn(e)}>&times;</a>
          <form className="signin_form" onSubmit={(e) => this.handleLogin(e)}>
            <h4 className="form_title">Sign In</h4>
            {hasError.error && (
              <div className="error-msg">
                {hasError.error}
              </div>
            )}
            <div className="field">
              <input
                type="text"
                value={email}
                name='email'
                onChange={this.handleChange}
                className={`field-input ${hasError.email !== undefined ? 'is-invalid' : ''}`}
              />
              <label htmlFor="email" className="field-label">Email</label>
              <div className='invalid-feedback'>{hasError.email}</div>
            </div>
            <div className="field">
              <input
                type="password"
                value={password}
                name='password'
                onChange={this.handleChange}
                className={`field-input ${hasError.password !== undefined ? 'is-invalid' : ''}`}
              />
              <label htmlFor="password" className="field-label">Password</label>
              <div className='invalid-feedback'>{hasError.password}</div>
            </div>
            <div className="flex_display">
              <div className="checkbox-new">
                <input type="checkbox" value="" />Remember me
              </div>
              <p className="remember"><a href="#/" onClick={(e) => this.forgotPassword(e)} data-target="#pwdModal" data-toggle="modal">Forgot Password</a></p>
            </div>
            <div className="text-center">
              <input type="submit" className="send_btn" value="Submit" />
            </div>
            <div className="new_user">
              <p>New user? <a href="#/" onClick={(e) => this.openSignUpNow(e)}>Sign Up Now</a></p>
            </div>
            <p className="text-center">Or</p>
            <p className="text-center">Sign in with</p>
          </form>

          <SocialLogin />

          {/* Forgot password modal popup */}
          <div id="pwdModal" data-backdrop="static" className="modal fade" tabIndex="-1" role="dialog" aria-hidden="true">
            <ForgotPassword />
          </div>

        </div>
      </React.Fragment>
    )
  }
}

const enhance = compose(
  withRouter,
  withApollo
);

export default enhance(Login);