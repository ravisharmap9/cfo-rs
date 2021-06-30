import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import Login from '../auth/Login';
import SignUp from '../auth/SignUp';
import $ from 'jquery';
import _ from 'lodash';
import UserUtils from '../utilities/UserUtils';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    $("#loadingDiv").show();
    let token = UserUtils.getAccessToken();
    if (!_.isEmpty(token)) {
      this.props.history.push('/my-stocks');
    }
    $("#loadingDiv").hide();
  }

  openSignUp() {
    document.getElementById("mySidebar").style.width = "400px";
  }

  closeSignIn() {
    document.getElementById("signIn").style.width = "0";
  }

  openSignUpNow() {
    this.closeSignIn();
    this.openSignUp();
  }

  render() {
    return (
      <React.Fragment>
        <SignUp />
        <Login />
        <div id="main">
          <section className="banner_section">
            <div className="videoWrapper">
            <video id="bgvid" preload="auto" muted autoPlay="true" loop playsinline>
              <source src="images/video.mp4" type="video/mp4" />
              
           </video>
          </div>
            <div className="container">
              <div className="banner_text">
                <div>
                <h1>The smartest way to manage your business</h1>
                <h3>Single unified platform to empower</h3>
                <div className="banner_btns">
                  <button type="button" className="signup_btn" onClick={() => this.openSignUp()}>Sign Up / Sign in</button>
                  <button type="button" className="works_btn">REQUEST DEMO</button>
                  </div>
                </div>
                
              </div>
            </div>
          </section>
          <section className="how_it_works">
            <div className="container">
              <div className="how_it_works_container">
              {/* <div className="row">
                <h2>How it Works</h2>
              </div> */}
              <div className="row">
              <div className="col-sm-3">
                  <div className="how-we-works">
                    <div className="image-block">
                    <img src="images/idea.png" />
                    </div>
                    <div>
                      <h3>Idea</h3>
                      <p>Generate investment ideas through our AI/ML driven models.</p>
                      <a href="#">Read More</a>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="how-we-works">
                    <div className="image-block">
                    <img src="images/invest.png" />
                    </div>
                    <div>
                      <h3>Investment </h3>
                      <p>Invest stress free based on your risk and return profile.</p>
                      <a href="#">Read More</a>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="how-we-works">
                    <div className="image-block">
                    <img src="images/accounting-new.png" />
                                  
                    </div>
                    <div>
                    <h3>Accounting </h3>
                      <p>Finances, Accounting, taxes, and compliance taken care of, automatically.</p>       
                      <a href="#">Read More</a>
                    </div>
                  </div>
                </div>
                
                
                <div className="col-sm-3">
                  <div className="how-we-works">
                    <div className="image-block">
                    <img src="images/analysis.png" />
                      
                    </div>
                    <div>
                    <h3>Analysis </h3>
                      <p>Scrutinize and analyze your investments and growth targets.</p>                    
                      <a href="#">Read More</a>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            </div>
          </section>
          <section className="about-section">
              <div className="container">
                <div className="row">
                  <div className="about-row">
                    <div className="col-sm-6">
                      <h3>ABOUT US</h3>
                      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Integer interdum sem ac magna. Integer in lectus sed ligula commodo commodo. In molestie, neque et porta lobortis, ligula sem auctor mauris, a luctus lacus quam sit amet augue. Aliquam eu felis.</p>
                      <button>Read More</button>
                    </div>
                    <div className="col-sm-6">
                      <img src="images/about.png" />
                    </div>
                  </div>
                </div>
              </div>
          </section>

          {/* <section className="how_it_works how_it_works2">
            <div className="container">
              <div className="row">
                <h2>How it Works</h2>
              </div>
              <div className="row">
                <div className="col-sm-6">
                <div className="how-we-works">
                    <div className="image-block">
                      <h3>Financial Statement</h3>
                      <p>We felt the pain too. As small business owners, we had to use lots of fragmented tools to run our business. But we had enough. With Omnicron you can manage all aspects of your business.</p>                    
                    </div>
                    <div>
                    <img src="images/ledger4.png" />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                <div className="how-we-works">
                    <div className="image-block">
                      <h3>Financial Statement</h3>
                      <p>We felt the pain too. As small business owners, we had to use lots of fragmented tools to run our business. But we had enough. With Omnicron you can manage all aspects of your business.</p>                    
                    </div>
                    <div>
                    <img src="images/ledger.png" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section> */}


          <section className="request_for_demo">
            <div className="container">
              <div className="requset-box">
                <h2>Request demo</h2>
                <p>To schedule a product demo with one of our product consultants, please fill in your contact details</p>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="formgroup">
                      <input type="text" placeholder="Full Name" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="formgroup">
                      <input type="text" placeholder="Email" />
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="formgroup">
                      <textarea placeholder="Type Your Message Here" rows="5"></textarea>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="formgroup">
                      <button className="btn btn-submit">Submit</button>
                    </div>
                  </div>
                  
                  
                </div>
                {/* <div className="contact-details">
                <div><p>info@cfoconnect.co</p></div>
                <div>
                  <p>Tel: +55555 55 5555</p>
                  <p>+61 222 333 666</p>
                </div>
                <div>
                <p>2-47, Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
                </div>
              </div> */}
              </div>
            </div>
          </section>
          <section className="client_logos">
            <div className="container">
              <div className="row">
                <div className="col-md-2 logo_image">
                  <img src="images/shyft.png" alt="" />
                </div>
                <div className="col-md-2 logo_image">
                  <img src="images/advisor.png" alt="" />
                </div>
                <div className="col-md-2 logo_image">
                  <img src="images/yello.png" alt="" />
                </div>
                <div className="col-md-2 logo_image">
                  <img src="images/gh.png" alt="" />
                </div>
                <div className="col-md-2 logo_image">
                  <img src="images/moment.png" alt="" />
                </div>
                <div className="col-md-2 logo_image">
                  <img src="images/social.png" alt="" />
                </div>
              </div>
            </div>
          </section>
          
          
          
        </div>
      </React.Fragment>
    )
  }
}
const enhance = compose(withRouter);

export default enhance(HomePage);