import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import compose from 'recompose/compose';
import SideBar from '../layout/sideBar';
import $ from 'jquery';
import * as commonFunctions from '../utilities/commonFunctions';
import UserUtils from '../utilities/UserUtils';
import _ from 'lodash';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { loader } from "graphql.macro";
const GET_LEDGER = loader('../../graphql/financials/getledger.graphql');
const GET_FINANCIAL_INCOME_STATEMENT = loader('../../graphql/financials/getFinancialIncomeStatement.graphql');

class Ledger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      ledgerData: [],
      incomeStatementData: [],
    }
  }

  componentDidMount() {
    $(window).scrollTop(0);
    let userToken = UserUtils.getAccessToken();
    if (!_.isEmpty(userToken)) {
      $("#loadingDiv").show();
      //TO GET LEDGER DATA
      this.props.client.query({
        query: GET_LEDGER,
        fetchPolicy: "network-only"
      }).then(response => {
        if (response.data.getFinancialLedger) {
          this.setState({ ledgerData: response.data.getFinancialLedger });
          // $("#loadingDiv").hide();
        }
      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        console.log(errorMsg);
        $("#loadingDiv").hide();
      });

      //TO GET INCOME STATEMENT DATA
      this.props.client.query({
        query: GET_FINANCIAL_INCOME_STATEMENT,
        fetchPolicy: "network-only"
      }).then(response => {
        if (response.data.getFinancialIncomeStatement) {
          this.setState({ incomeStatementData: response.data.getFinancialIncomeStatement });
          $("#loadingDiv").hide();
        }
      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        console.log(errorMsg);
        $("#loadingDiv").hide();
      });
    }
  }

  render() {
    let { ledgerData, incomeStatementData } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          <SideBar />
          <div className="col-md-9 right_info stock-pages-data">
            <div className=" col-md-12 bradcomes">
              <div className=" col-md-10">
                <h4>Ledger</h4>
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
                      {ledgerData && ledgerData.length === 0 && <tr><td colSpan="4" className="data-not-found text-center"><b >No Data Available</b></td></tr>}
                      {ledgerData.map((d, index) => {
                        return (
                          <React.Fragment>
                            <tr key={index}>
                              <td> {(d.debit.buy_date && moment(d.debit.buy_date).format('MM-DD-YYYY')) || '-'}</td>
                              <td>{d.debit.description}</td>
                              <td>{d.debit.total}</td>
                              <td>{'-'}</td>
                            </tr>
                            <tr>
                              <td>{(d.credit.buy_date && moment(d.credit.buy_date).format('MM-DD-YYYY')) || '-'}</td>
                              <td>{d.credit.description}</td>
                              <td>{'-'}</td>
                              <td>{d.credit.total}</td>
                            </tr>
                          </React.Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <hr />
                <h4>Income Statement</h4>
                <div className="table-responsive">
                  <Scrollbars autoHeight autoHeightMax={530}>
                    <table id="mytable" className="table table-bordred table-striped">
                      <thead>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Debit</th>
                        <th>Credit</th>
                      </thead>
                      <tbody>
                        {incomeStatementData && incomeStatementData.length === 0 && <tr><td colSpan="4" className="data-not-found text-center"><b >No Data Available</b></td></tr>}
                        {incomeStatementData.length > 0 && incomeStatementData.map((d, index) => {
                          return (
                            <React.Fragment>
                              <tr key={index}>
                                <td> {(d.debit.date && moment(d.debit.date).format('MM-DD-YYYY')) || '-'}</td>
                                <td>{d.debit.description}</td>
                                {d.debit.gain_or_loss === "gain"
                                  ? <React.Fragment>
                                    <td>{d.debit.price}</td>
                                    <td>{'-'}</td>
                                  </React.Fragment>
                                  : <React.Fragment>
                                    <td>{"-"}</td>
                                    <td>{d.debit.price}</td>
                                  </React.Fragment>
                                }
                              </tr>
                              <tr>
                                <td>{(d.credit.date && moment(d.credit.date).format('MM-DD-YYYY')) || '-'}</td>
                                <td>{d.credit.description}</td>
                                {d.credit.gain_or_loss === "gain"
                                  ? <React.Fragment>
                                    <td>{'-'}</td>
                                    <td>{d.credit.price}</td>
                                  </React.Fragment>
                                  : <React.Fragment>
                                    <td>{d.credit.price}</td>
                                    <td>{'-'}</td>
                                  </React.Fragment>
                                }
                              </tr>
                            </React.Fragment>
                          )
                        })}
                      </tbody>
                    </table>
                  </Scrollbars>
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

export default enhance(Ledger);