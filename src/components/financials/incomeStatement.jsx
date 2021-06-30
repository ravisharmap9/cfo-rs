import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import compose from 'recompose/compose';
import SideBar from '../layout/sideBar';
import _ from 'lodash';
import $ from 'jquery';
import * as commonFunctions from '../utilities/commonFunctions';
import UserUtils from '../utilities/UserUtils';
// import moment from 'moment';
import { loader } from "graphql.macro";
// const GET_USER_BUY_STOCKS = loader('../../graphql/financials/getUserBuyStocks.graphql');
const GET_INCOME_SHEET = loader('../../graphql/financials/getIncomeStatement.graphql');

class IncomeStatement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockName: "",
      buyedUserStockData: [],
      incomeStatementData: "",
    }
  }

  componentDidMount() {
    $(window).scrollTop(0);
    let userToken = UserUtils.getAccessToken();
    if (!_.isEmpty(userToken)) {
      $("#loadingDiv").show();
      // this.props.client.query({
      //   query: GET_USER_BUY_STOCKS,
      //   fetchPolicy: "network-only"
      // }).then(response => {
      //   console.log(response.data.GetUserBuyStockForBalanceSheet, 'response.data.GetUserBuyStockForBalanceSheet');
      //   if (response.data.GetUserBuyStockForBalanceSheet) {
      //     this.setState({ buyedUserStockData: response.data.GetUserBuyStockForBalanceSheet });
      //     $("#loadingDiv").hide();
      //   }
      // }).catch(error => {
      //   let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
      //   console.log(errorMsg);
      //   $("#loadingDiv").hide();
      // });

      this.props.client.query({
        query: GET_INCOME_SHEET,
        fetchPolicy: "network-only"
      }).then(response => {
        if (response.data.getIncomeStatement) {
          this.setState({ incomeStatementData: response.data.getIncomeStatement });
          $("#loadingDiv").hide();
        }
      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        console.log(errorMsg);
        $("#loadingDiv").hide();
      });

    } else {
      this.props.history.push('/');
    }
  }

  handleSelectStock(e, index) {
    this.setState({ stockName: e.target.value });
  }

  render() {
    let {
      // stockName,
      // buyedUserStockData,
      // incomeStatementData
      incomeStatementData
    } = this.state;
    // let optionData = [];
    // buyedUserStockData && buyedUserStockData.length > 0 && buyedUserStockData.map((d, index) => {
    //   optionData.push(<option key={index} value={d.id}>{d.stock_name}</option>)
    //   return null
    // });
    // const stockDataById = buyedUserStockData.filter(x => x.id === stockName)[0];

    return (
      <React.Fragment>
        <div className="row">
          <SideBar />
          <div className="col-md-9 right_info balance-sheet-page">
            <div className=" col-md-12 bradcomes">
              <h4>Income Statement</h4>
              {/* <div className="row buy-stock-data">
                <div className="col-md-2">Select Stock:</div>
                <div className="col-md-4">
                  <select id="buyStockData" className="form-control" name="stockName" value={stockName} onChange={(e) => this.handleSelectStock(e)}>
                    <option value="">-Select Stock-</option>
                    {optionData}
                  </select>
                </div>
              </div> */}
              <div className="row buy-stock-data new-design">
                <div className="col-md-6 table-responsive">
                  <table className="table">
                    <tr>
                      <th className="heading-data" colSpan="2">Income Statement</th>
                    </tr>
                    <tr>
                      <th>Revenue</th>
                      <td>0</td>
                    </tr>
                    <tr>
                      <th >COGS</th>
                      <td>0</td>
                    </tr>
                    <tr>
                      <th>Gross Profit</th>
                      <td>0</td>
                    </tr>
                    <tr>
                      <th className="lab-equity" >All expenses</th>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Net Profit</th>
                      <td>0</td>
                    </tr>
                    <tr>
                      <th>Mark to Market</th>
                      <td>{(incomeStatementData && commonFunctions.getPriceCommaSeprated(incomeStatementData.mark_to_market_value.toFixed(3))) || '0'}</td>
                    </tr>
                    <tr>
                      <th>Net Income</th>
                      <td>{(incomeStatementData && commonFunctions.getPriceCommaSeprated(incomeStatementData.net_income.toFixed(3))) || '0'}</td>
                    </tr>
                  </table>
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

export default enhance(IncomeStatement);