import React, { Component } from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';

class Footer extends Component {
  render() {
    return (
      <React.Fragment>
        <footer className="footer_row">
          <div className="container">
            <div className="col-md-12">
              <div className="col-md-4 col-sm-4">
                <div>
                  <a href="#/"><img src="/images/footer_logo.png" alt="imag" /></a>
                  <h3>CFO Connect</h3>
                </div>
              </div>
              <div className="col-md-4 col-sm-4">
                <p>Stay Connected</p>
                <ul>
                  <li><a href="#/"><i className="fab fa-facebook-f"></i>
										Facebook</a></li>
                  <li><a href="#/"><i className="fab fa-twitter"></i> Twitter</a></li>
                  <li><a href="#/"><i className="fab fa-linkedin-in"></i>
										LinkedIn</a></li>
                  <li><a href="#/"><i className="fab fa-instagram"></i>
										Instagram</a></li>
                </ul>
              </div>
              <div className="col-md-4 col-sm-4">
                <p>About</p>
                <ul>
                  <li><a href="#/">About us</a></li>
                  <li><a href="#/">Help</a></li>
                  <li><a href="#/">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
        <div className="copy-rights">
          <p>&copy; Copyright all reserved CFO Connect </p>
        </div>
      </React.Fragment>
    )
  }
}

const enhance = compose(withRouter);
export default enhance(Footer);