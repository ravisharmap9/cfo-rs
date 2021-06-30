import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import compose from 'recompose/compose';
import UserUtils from '../utilities/UserUtils';
import _ from 'lodash';
import { loader } from "graphql.macro";
import * as commonFunctions from '../utilities/commonFunctions';
const USER = loader('../../graphql/auth/user.graphql');
const LOGOUT = loader('../../graphql/auth/logout.graphql');

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: null,
      userData: "",
    }
  }

  componentDidMount() {
    let userToken = UserUtils.getAccessToken();
    if (!_.isEmpty(userToken)) {
      this.setState({ userToken: userToken });
      let userId = UserUtils.getUserID();
      this.props.client.query({
        query: USER,
        variables: {
          id: userId
        },
        fetchPolicy: "network-only"
      }).then(response => {
        if (response.data.user) {
          this.setState({ userData: response.data.user });
        }
      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        console.log(errorMsg);
      });
    }
  }

  // OPEN SIGN IN FORM
  openSignIn(e) {
    e.preventDefault();
    if (document.getElementById("signIn") !== null) {
      document.getElementById("signIn").style.width = "400px";
    } else {
      this.props.history.push('/');
    }
  }
  //OPEN SIGN UP FORM 
  openSignUp(e) {
    e.preventDefault();
    if (document.getElementById("mySidebar") !== null) {
      document.getElementById("signIn").style.width = "400px";
    } else {
      this.props.history.push('/');
    }
  }

  getHelp(e) {
    e.preventDefault();
    this.props.history.push('/get-help');
  }

  //LOGOUT
  logout(e) {
    e.preventDefault();
    this.props.client.mutate({
      mutation: LOGOUT,
    }).then(response => {
      console.log(response)
    }).catch(error => {
      console.log(error);
      let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
      console.log(errorMsg, 'error')
    });
    localStorage.clear();
    this.props.history.push('/');
  }

  redirectToHome(e) {
    e.preventDefault();
    this.props.history.push('/');
  }

  // REDIRECT TO EDIT PROFILE PAGE
  editProfile(e) {
    e.preventDefault();
    this.props.history.push('/edit-profile');
  }

  render() {
    let { userToken, userData } = this.state;
    const pageUrl = this.props.location.pathname;
    let getHelpActive, editProfileActive;
    if (pageUrl.includes('/get-help')) {
      getHelpActive = 'active';
    }
    if (pageUrl.includes('/edit-profile')) {
      editProfileActive = 'active';
    }
    return (
      <React.Fragment>
        <div className="nav-top">
          <div className="container">
            <div className="nav-flex">
              <div className="nav-top-left">
                <ul>
                  <li><i className="far fa-envelope"></i> info@cfoconnect.com</li>
                  <li><i className="fas fa-phone"></i> +61 222 333 666</li>
                </ul>
              </div>
              <div className="nav-top-right">
                <ul>
                  <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                  <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                  <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                  <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <nav className={`navbar navbar-inverse ${userToken !== null ? 'bg-dark' : ''} header_main`}>
          <div className="container">
            <div className="row header_row">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="#/" onClick={(e) => this.redirectToHome(e)}><img src="/images/CFO_LOGO.png" alt="" /></a>
              </div>
              <div className="collapse navbar-collapse" id="myNavbar">
                <ul className="nav navbar-nav navbar-right right_menu">

                  {userToken !== null
                    ? <React.Fragment>
                      <li className={`dropdown ${editProfileActive}`}>
                        <a className="dropdown-toggle" role="button" data-toggle="dropdown" href="#/"><i className="fa fa-user-circle"></i> {userData.first_name && userData.first_name} <span className="caret"></span></a>
                        <ul id="g-account-menu" className="dropdown-menu" role="menu">
                          <li className="drop-down-li"><i className="fa fa-user"></i><a href="#/" onClick={(e) => this.editProfile(e)}>&nbsp;Account Profile </a></li>
                        </ul>
                      </li>
                      <li className="Logout"><a href="#/" onClick={(e) => this.logout(e)}>Logout</a></li>
                    </React.Fragment>
                    : (!pageUrl.includes('/reset-password')) &&
                    (<React.Fragment>
                      <li><a href="#/">Home</a></li>
                      <li><a href="#/">About</a></li>
                      <li><a href="#/">How it Works</a></li>
                      <li><a href="#/">Features</a></li>
                      <li><a href="#/">Testimonials</a></li>
                      <li><a href="#/">Request demo</a></li>
                      <li><a href="#/">Blog</a></li>
                      {/* <li><a href="#/" onClick={(e) => this.openSignIn(e)}>Sign In </a></li> */}
                      {/* <li>
                        <a href="#/" className="start_link">
                          <button type="button" className="start_btn" onClick={(e) => this.openSignUp(e)}>Get Started</button>
                        </a>
                      </li> */}

                    </React.Fragment>
                    )}
                  <li className="getHelpActive"><a href="#/" onClick={(e) => this.getHelp(e)}>Get Help</a></li>

                </ul>
              </div>
            </div>

          </div>
        </nav>
      </React.Fragment >
    )
  }
}

const enhance = compose(
  withRouter,
  withApollo
);
export default enhance(Header);