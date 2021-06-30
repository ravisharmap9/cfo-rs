import React, { Component } from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as commonFunctions from '../utilities/commonFunctions';
import UserUtils from '../utilities/UserUtils';
import { OldSocialLogin as SocialLogin } from 'react-social-login';
import $ from 'jquery';
import { loader } from "graphql.macro";
const SOCAIL_LOGIN = loader('../../graphql/auth/socialLogin.graphql');

const GOOGLE_SCRECT_ID = process.env.REACT_APP_GOOGLE_SCRECT_ID;
const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

class SocialLogins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: {},

    }
    this.socialLoginWithGoogle = this.socialLoginWithGoogle.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  }

  // Google Login
  socialLoginWithGoogle(user) {
    let errors = {};
    if (user) {
      $("#loadingDiv").show();
      this.props.client.mutate({
        mutation: SOCAIL_LOGIN,
        variables: {
          "provider": 'GOOGLE',
          "token": user._token.accessToken,
        }
      }).then(response => {
        if (response.data) {
          UserUtils.setAccessToken(response.data.socialLogin.user.access_token);
          UserUtils.setUserID(response.data.socialLogin.user.user.id);
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

  // Facebook Login
  handleFacebookLogin(user) {
    let errors = {};
    if (user) {
      $("#loadingDiv").show();
      this.props.client.mutate({
        mutation: SOCAIL_LOGIN,
        variables: {
          "provider": 'FACEBOOK',
          "token": user._token.accessToken,
        }
      }).then(response => {
        if (response.data) {
          UserUtils.setAccessToken(response.data.socialLogin.user.access_token);
          UserUtils.setUserID(response.data.socialLogin.user.user.id);
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

  render() {
    let { hasError } = this.state;
    return (
      <React.Fragment>
        <div className="text-center">
          {hasError.error && (
            <div className="error-msg">
              {hasError.error}
            </div>
          )}
          <button className="google_btn">
            <SocialLogin
              provider='google'
              appId={GOOGLE_SCRECT_ID}
              callback={this.socialLoginWithGoogle}>
              <span><i className="fab fa-google"></i>&nbsp;&nbsp;Sign in with Google</span>
            </SocialLogin>
          </button>
        </div>
        <div className="text-center">
          <button className="linked_btn">
            <SocialLogin
              provider='facebook'
              appId={FACEBOOK_APP_ID}
              callback={this.handleFacebookLogin}
            >
              <span><i className="fab fa-facebook"></i>&nbsp; Sign in with Facebook</span>
            </SocialLogin>
          </button>

        </div>
      </React.Fragment>
    )
  }
}

const enhance = compose(
  withRouter,
  withApollo
);

export default enhance(SocialLogins);