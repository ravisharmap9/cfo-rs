import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import compose from 'recompose/compose';
import * as commonFunctions from '../utilities/commonFunctions';
import $ from 'jquery';
import { loader } from "graphql.macro";
const FORGOT_PASSWORD = loader('../../graphql/auth/forgotPassword.graphql');

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      error: null,
      email: '',
      hasError: {}
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      hasError: {}
    });
  }

  validateForm() {
    let errors = {};
    let formIsValid = true;
    let { email } = this.state;
    //Email 
    if (!email) {
      formIsValid = false;
      errors["email"] = "Please enter your email address.";
    }
    if (email !== "" && !commonFunctions.validateEmail(email)) {
      formIsValid = false;
      errors["email"] = "Please enter a valid email address.";
    }
    this.setState({ hasError: errors });
    return formIsValid;
  }

  handleForgotPassword(e) {
    e.preventDefault();
    if (this.validateForm()) {
      let { email } = this.state;
      let errors = {};
      $("#loadingDiv").show();
      this.props.client.mutate({
        mutation: FORGOT_PASSWORD,
        variables: {
          "email": email
        }
      }).then(response => {
        if (response.data.forgotPassword.status === 'EMAIL_NOT_SENT') {
          errors['error'] = response.data.forgotPassword.message;
          this.setState({ hasError: errors });
          $("#loadingDiv").hide();
        } else if (response.data.forgotPassword.status === 'PASSWORD_NOT_UPDATED') {
          errors['error'] = response.data.forgotPassword.message;
          this.setState({ hasError: errors });
          $("#loadingDiv").hide();
        } else {
          this.setState({ success: response.data.forgotPassword.message });
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

  closeFunc() {
    this.setState({ hasError: {}, success: null, email: '' });
  }

  render() {
    let { email, hasError, success } = this.state;
    return (
      <React.Fragment>
        <div id="forgotPassword" className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={() => this.closeFunc()} data-dismiss="modal" aria-hidden="true">×</button>
              <h3 className="text-center">Forgot Password</h3>
            </div>
            <div className="modal-body">
              <div className="col-md-12">
                <div className="panel panel-default">
                  <form name="forgotPassword" onSubmit={(e) => this.handleForgotPassword(e)}>
                    <div className="panel-body">
                      {hasError.error !== null && (
                        <div className="error-msg text-center">
                          {hasError.error}
                        </div>
                      )}
                      {success && (
                        <div className="success-msg text-success text-center">
                          {success}
                        </div>
                      )}
                      <h5>Please enter your Email address here.</h5>
                      <div className='invalid-feedback'>{hasError.email}</div>
                      <div className="form-group">
                        <input
                          id="inputPassword"
                          value={email}
                          onChange={this.handleChange}
                          className={`form-control ${hasError.email !== undefined ? 'is-invalid' : ''}`}
                          name="email"
                          type="text"
                        />
                      </div>
                      <div className="form-group">
                        <button type="submit" className="btn btn-primary update-pswd">Update Password</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="col-md-12">
                <button onClick={() => this.closeFunc()} className="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
              </div>
            </div>
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

export default enhance(ForgotPassword);