import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import compose from 'recompose/compose';
import * as commonFunctions from '../utilities/commonFunctions';
import { loader } from "graphql.macro";
import $ from 'jquery';
const REGISTER = loader('../../graphql/auth/signup.graphql');

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      error: null,
      hasError: {},

      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      termsConditions: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleTermsCondition = this.handleTermsCondition.bind(this);
  }

  /**signin and signup form open and close func */
  openSignUp() {
    document.getElementById("mySidebar").style.width = "400px";
  }

  closeSignUp(e) {
    e.preventDefault();
    document.getElementById("mySidebar").style.width = "0";
    this.setState({ hasError: {} });
  }

  openSignIn(e) {
    e.preventDefault();
    document.getElementById("signIn").style.width = "400px";
    this.closeSignUp(e);
  }

  closeSignIn() {
    document.getElementById("signIn").style.width = "0";
    this.setState({ hasError: {} });
  }

  openSignUpNow() {
    this.closeSignIn();
    this.openSignUp();
    this.setState({ hasError: {} });
  }
  /*ends here */

  /**Handle form fields */
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.setState({ hasError: {} });
  }

  /**Handle terms and conditions */
  handleTermsCondition(e) {
    this.setState({ termsConditions: e.target.checked });
    this.setState({ hasError: {} });
  }

  // Function to validate
  validateForm() {
    let errors = {};
    let formIsValid = true;
    let {
      email,
      password,
      phoneNumber,
      firstName,
      lastName,
      confirmPassword,
      termsConditions
    } = this.state;

    // Validation for
    //Email
    if (!email) {
      formIsValid = false;
      errors["email"] = "Please enter your email address.";
    }
    if (email !== "" && !commonFunctions.validateEmail(email)) {
      formIsValid = false;
      errors["email"] = "Please enter a valid email address.";
      this.setState({ email: '' });
    }
    // Phone Number
    if (!phoneNumber) {
      formIsValid = false;
      errors["phoneNumber"] = "Please enter your 10-digit Phone number.";
    }
    if (phoneNumber !== "" && !commonFunctions.validPhonenumber(phoneNumber)) {
      formIsValid = false;
      errors["phoneNumber"] = "Please enter a Valid 10-digit Phone number.";
      this.setState({ phoneNumber: '' });
    }
    // Password
    if (!password) {
      formIsValid = false;
      errors["password"] = "Please enter your password.";
    }

    if (password && password.length < 8) {
      formIsValid = false;
      errors["password"] = "password must be at least 8 characters.";
      this.setState({ password: '' });
    }

    if (!confirmPassword) {
      formIsValid = false;
      errors["confirmPassword"] = "Please enter your confirmation password.";
    }

    if (confirmPassword && confirmPassword !== password) {
      formIsValid = false;
      errors["confirmPassword"] = "Password and confirmation password does not match.";
      this.setState({ confirmPassword: '' });
    }

    // Term & condition
    if (!termsConditions) {
      formIsValid = false;
      errors["termsConditions"] = "Please accept the terms & conditions.";
    }

    // First Name
    if (!firstName) {
      formIsValid = false;
      errors["firstName"] = "Please Enter a first name.";
    }

    if (firstName && !commonFunctions.validateNames(firstName)) {
      formIsValid = false;
      errors["firstName"] = "You can not have spaces in First name.";
      this.setState({ firstName: '' });
    }

    //Last Name
    if (!lastName) {
      formIsValid = false;
      errors["lastName"] = "Please Enter a last name.";
    }

    if (lastName && !commonFunctions.validateNames(lastName)) {
      formIsValid = false;
      errors["lastName"] = "You can not have spaces in Last name.";
      this.setState({ lastName: '' });
    }

    this.setState({ hasError: errors });
    return formIsValid;

  }
  /**Sign up form submit */
  signUp(e) {
    e.preventDefault();
    let {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      // termsConditions,
      confirmPassword,
    } = this.state;
    let errors = {};

    if (this.validateForm()) {
      $("#loadingDiv").show();
      this.props.client.mutate({
        mutation: REGISTER,
        variables: {
          "first_name": firstName,
          "last_name": lastName,
          "email": email,
          "password": password,
          "phone_number": phoneNumber,
          "password_confirmation": confirmPassword
        }
      }).then(response => {
        if (response.data.register.status === 'USER_REGISTERED') {
          this.setState({
            success: 'User Register Successfullly. Please Login.',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            termsConditions: false
          });
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

  render() {
    let {
      success,
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      termsConditions,
      hasError,
    } = this.state;

    return (
      <React.Fragment>
        <div id="mySidebar" className="sidebar">
          <a href="#/" className="closebtn" onClick={(e) => this.closeSignUp(e)}>&times;</a>
          <form className="signup" onSubmit={(e) => this.signUp(e)}>
            <h4 className="form_title">Sign Up</h4>
            {hasError.error && (
              <div className="error-msg">
                {hasError.error}
              </div>
            )}
            {success && (
              <div className="success-msg text-success">
                {success}
              </div>
            )}

            <div className="field">
              <input
                type="text"
                id="first-name"
                name="firstName"
                value={firstName}
                onChange={this.handleChange}
                className={`field-input ${hasError.firstName !== undefined ? 'is-invalid' : ''}`}
              />
              <label htmlFor="first-name" className="field-label">First Name</label>
              <div className='invalid-feedback'>{hasError.firstName}</div>
            </div>
            <div className="field">
              <input
                type="text"
                id="last-name"
                name="lastName"
                value={lastName}
                onChange={this.handleChange}
                className={`field-input ${hasError.lastName !== undefined ? 'is-invalid' : ''}`}
              />
              <label htmlFor="last-name" className="field-label">Last Name</label>
              <div className='invalid-feedback'>{hasError.lastName}</div>
            </div>
            <div className="field">
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                className={`field-input ${hasError.email !== undefined ? 'is-invalid' : ''}`}
              />
              <label htmlFor="email" className="field-label">Email Address</label>
              <div className='invalid-feedback'>{hasError.email}</div>
            </div>
            <div className="field">
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                max="10"
                value={phoneNumber}
                onChange={this.handleChange}
                className={`field-input ${hasError.phoneNumber !== undefined ? 'is-invalid' : ''}`}
              />
              <label htmlFor="mobile" className="field-label">Mobile Number</label>
              <div className='invalid-feedback'>{hasError.phoneNumber}</div>
            </div>
            <div className="field">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                className={`field-input ${hasError.password !== undefined ? 'is-invalid' : ''}`}
              />
              <label htmlFor="password" className="field-label">Password</label>
              <div className='invalid-feedback'>{hasError.password}</div>
            </div>
            <div className="field">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={this.handleChange}
                className={`field-input ${hasError.confirmPassword !== undefined ? 'is-invalid' : ''}`}
              />
              <label htmlFor="password" className="field-label">Confirm Password</label>
              <div className='invalid-feedback'>{hasError.confirmPassword}</div>
            </div>

            <div className="checkbox-new">
              <input
                type="checkbox"
                name="termsConditions"
                className={`${hasError.termsConditions !== undefined ? 'is-invalid termsCheckbox' : 'termsCheckbox'}`}
                onChange={(e) => this.handleTermsCondition(e)}
                checked={termsConditions}
              />
              I agree to the terms and &nbsp;<a href="#/">Privacy Policy</a>

            </div>
            <div className='invalid-feedback terms-n-condition'>{hasError.termsConditions}</div>
            <div className="sign_link">
              <input type="submit" value="Submit" className="send_btn" />
              <p><a href="#/" onClick={(e) => this.openSignIn(e)}>Sign In&nbsp;<i className="fas fa-arrow-right"></i></a></p>
            </div>
          </form>
        </div>
      </React.Fragment>
    )
  }
}

const enhance = compose(
  withRouter,
  withApollo
);
export default enhance(SignUp);