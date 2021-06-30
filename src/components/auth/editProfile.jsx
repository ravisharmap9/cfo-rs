import React, { Component } from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import SideBar from '../layout/sideBar';
import { withApollo } from "react-apollo";
import $ from 'jquery';
import _ from 'lodash';
import UserUtils from '../utilities/UserUtils';
import * as commonFunctions from '../utilities/commonFunctions';
import Switch from "react-switch";
import { loader } from "graphql.macro";

const USER = loader('../../graphql/auth/user.graphql');
const EDIT_PROFILE = loader('../../graphql/auth/updateProfile.graphql');

class EditProfile extends Component {
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
      address: "",
      emailSubscriptionChecked: false
    }
  }
  
  handleSubscribeChange(checked) {
    this.setState({ emailSubscriptionChecked: checked });
  }

  componentDidMount() {
    let userToken = UserUtils.getAccessToken();
    if (!_.isEmpty(userToken)) {
      $(window).scrollTop(0);
      $("#loadingDiv").show();
      this.setState({ userToken: userToken });
      let userId = UserUtils.getUserID();
      let errors = {};
      this.props.client.query({
        query: USER,
        variables: {
          id: userId
        },
        fetchPolicy: "network-only"
      }).then(response => {
        if (response.data.user) {
          this.setState({
            userData: response.data.user,
            firstName: response.data.user.first_name,
            lastName: response.data.user.last_name,
            email: response.data.user.email,
            phoneNumber: response.data.user.phone_number,
            address: response.data.user.address ? response.data.user.address : ''
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

  /**Handle form fields */
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
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
      // address
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

    if (password && password.length < 8) {
      formIsValid = false;
      errors["password"] = "password must be at least 8 characters.";
      this.setState({ password: '' });
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

  // UPDATE PROFILE SUBMIT METHOD
  updateProfile(e) {
    e.preventDefault();
    let {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      address,
    } = this.state;
    let errors = {};
    if (this.validateForm()) {
      $("#loadingDiv").show();
      this.props.client.mutate({
        mutation: EDIT_PROFILE,
        variables: {
          "first_name": firstName,
          "last_name": lastName,
          "email": email,
          "password": password,
          "phone_number": phoneNumber,
          "address": address
        }
      }).then(response => {
        if (response.data.editProfile) {
          this.setState({
            success: 'User Updated Successfullly!',
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
      address,
      hasError,
      emailSubscriptionChecked
    } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          <SideBar />
          <div className="col-md-9 right_info edit-profile">
            <div className="form_wrapper">
              <div className="row clearfix">
                <div className="card card-info">
                  <form name="addAdmin" onSubmit={(e) => this.updateProfile(e)}>
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
                    <div className="card-body">
                      <div className="row">
                        <div className="title_container">
                          <h3>UPDATE PROFILE</h3>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="exampleInputPassword1">First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              value={firstName}
                              onChange={(e) => this.handleChange(e)}
                              className="form-input"
                            />
                            {hasError.firstName && <div className='invalid-feedback'>{hasError.firstName}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              value={lastName}
                              onChange={(e) => this.handleChange(e)}
                              className="form-input"
                            />
                            {hasError.lastName && <div className='invalid-feedback'>{hasError.lastName}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Email</label>
                            <input
                              disabled
                              type="text"
                              name="email"
                              value={email}
                              onChange={(e) => this.handleChange(e)}
                              className="form-input"
                            />
                            {hasError.email && <div className='invalid-feedback'>{hasError.email}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input
                              type="text"
                              name="password"
                              value={password}
                              onChange={(e) => this.handleChange(e)}
                              className="form-input"
                            />
                            {hasError.password && <div className='invalid-feedback'>{hasError.password}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Phone Number</label>
                            <input
                              type="text"
                              name="phoneNumber"
                              value={phoneNumber}
                              onChange={(e) => this.handleChange(e)}
                              className="form-input"
                            />
                            {hasError.phoneNumber && <div className='invalid-feedback'>{hasError.phoneNumber}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Address</label>
                            <textarea
                              className="form-control"
                              // rows="5"
                              name="address"
                              id="address"
                              value={address}
                              onChange={(e) => this.handleChange(e)}
                            ></textarea>
                            {hasError.address && <div className='invalid-feedback'>{hasError.address}</div>}
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <button type="submit" className="btn btn-primary text-center">UPDATE PROFILE</button>
                      </div>
                    </div>
                  </form>

                  <div className="card-body email-alert">
                    <div className="title_container">
                      <h4>ALERT SETTING</h4>
                    </div>
                    <div className="row">
                      <div className="col-md-4"><b>Email Subscription:</b></div>
                      <div className="col-md-4">
                        <span title={emailSubscriptionChecked ? 'Subscribed' : 'Unsubscribe'}>
                          <Switch
                            onChange={(e) => this.handleSubscribeChange(e)}
                            checked={emailSubscriptionChecked}
                            aria-labelledby="neat-label"
                          />
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      </React.Fragment >
    )
  }
}

const enhance = compose(
  withRouter,
  withApollo
);
export default enhance(EditProfile);