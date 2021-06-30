import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import compose from 'recompose/compose';
import SideBar from '../layout/sideBar';

class JournalEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <SideBar />
          <div className="col-md-9 right_info stock-pages-data">
            <div className=" col-md-12 bradcomes">
              <h4>Journal Entery</h4>
              <div className="table-responsive">
                <table id="mytable" className="table table-bordred table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Debit</th>
                      <th>Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colSpan="4" className="data-not-found text-center"><b >No Data Available</b></td></tr>
                  </tbody>
                </table>
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

export default enhance(JournalEntry);