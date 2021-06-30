import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import compose from 'recompose/compose';
// import SideBar from '../layout/sideBar';
// import * as commonFunctions from '../utilities/commonFunctions';
// import { loader } from "graphql.macro";
// import ForgotPassword from './forgotPassword';
// import $ from 'jquery';
// import UserUtils from '../utilities/UserUtils';
// import SocialLogin from './socialLogin';
// const LOGIN = loader('../../graphql/auth/signin.graphql');

class AlertSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {

    return (
      <React.Fragment>
        <div className="row">
          {/* <SideBar /> */}
          <div className="col-md-9 right_info edit-profile">
            <div className="form_wrapper contact-us">
              <div className="row clearfix">
                <div className="card card-info">
                  <div className="row">
                    <h3>Contact Us</h3>
                    {/* <div className="col-sm-12"> */}
                    <table className="table" >
                      <tr>
                        <td><label for="Name">Name*:</label></td>
                        <td><input className="form-control input-field" name="Name" type="text" maxLength="60" /></td>
                      </tr>
                      <tr>
                        <td> <label for="PhoneNumber">Phone number:</label></td>
                        <td><input className="form-control input-field" name="PhoneNumber" type="text" maxLength="43" /></td>
                      </tr>
                      <tr>
                        <td><label for="FromEmailAddress">Email address*:</label> </td>
                        <td><input className="form-control input-field" name="FromEmailAddress" type="text" maxLength="90" /></td>
                      </tr>
                      <tr>
                        <td><label for="Comments">Comments*:</label></td>
                        <td><textarea className="form-control input-field" name="Comments" rows="5" cols="25"></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td><input className="form-control btn btn-primary submit-btn" name="skip_Submit" type="submit" value="Submit" /> </td>
                      </tr>
                    </table>
                    {/* </div> */}
                  </div>
                </div>
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

export default enhance(AlertSetting);