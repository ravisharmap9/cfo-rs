import React from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import Footer from './footer';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';

const Layout = (props) => {
  let { component: Component } = props;

  return (
    <React.Fragment>
      <Header />
       <Component />
      <Footer />
    </React.Fragment>
  )
}

Layout.propTypes = {
  component: PropTypes.func.isRequired,
};

const enhance = compose(withRouter);
export default enhance(Layout);
