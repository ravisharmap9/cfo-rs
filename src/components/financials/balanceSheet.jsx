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
const GET_FINANCIAL_BALANCE_SHEET = loader('../../graphql/financials/getFinancialBalanceSheet.graphql');

class BalanceSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockName: "",
      buyedUserStockData: [],
      balanceSheetData: ""
    }
  }

  componentDidMount() {
    $(window).scrollTop(0);
    let userToken = UserUtils.getAccessToken();
    if (!_.isEmpty(userToken)) {

      // $("#loadingDiv").show();
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

      $("#loadingDiv").show();
      this.props.client.query({
        query: GET_FINANCIAL_BALANCE_SHEET,
        fetchPolicy: "network-only"
      }).then(response => {
        if (response.data.getFinancialBalanceSheet) {
          this.setState({ balanceSheetData: response.data.getFinancialBalanceSheet });
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

  // handleSelectStock(e, index) {
  //   this.setState({ stockName: e.target.value });
  //   $("#loadingDiv").show();
  //   this.props.client.query({
  //     query: GET_FINANCIAL_BALANCE_SHEET,
  //     variables: {
  //       'id': e.target.value
  //     },
  //     fetchPolicy: "network-only"
  //   }).then(response => {
  //     if (response.data.getFinancialBalanceSheet) {
  //       this.setState({ balanceSheetData: response.data.getFinancialBalanceSheet });
  //       $("#loadingDiv").hide();
  //     }
  //   }).catch(error => {
  //     let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
  //     console.log(errorMsg);
  //     $("#loadingDiv").hide();
  //   });
  // }

  render() {
    let {
      // stockName,
      // buyedUserStockData,
      balanceSheetData
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
              <h4>Balance Sheet</h4>
              <div className="row buy-stock-data-1">
                {/* <div className="col-md-2">Select Stock:</div>
                <div className="col-md-4">
                  <select id="buyStockData" className="form-control" name="stockName" value={stockName} onChange={(e) => this.handleSelectStock(e)}>
                    <option value="">-Select Stock-</option>
                    {optionData}
                  </select>
                </div> */}
                <div className="col-md-6 table-responsive">
                  <table className="table">
                    <tr>
                      <th className="heading-data" colSpan="2">Balance Sheet</th>
                    </tr>
                    <tr>
                      <th className="heading-data-1" colSpan="2">Asset</th>
                    </tr>
                    <tr>
                      <th>Cash</th>
                      <td>-{(balanceSheetData && balanceSheetData.paid_in_capital) || '0'}</td>
                    </tr>
                    <tr>
                      <th>Investment Account</th>
                      <td>{(balanceSheetData && balanceSheetData.investment_account) || '0'}</td>
                    </tr>
                    <tr>
                      <th>Fair value account</th>
                      <td>{(balanceSheetData && balanceSheetData.fair_value_account) || '0'}</td>
                    </tr>
                    <tr>
                      <th className="lab-equity" >Liab + Equity</th>
                      <td>{(balanceSheetData && balanceSheetData.lib_and_equity)}</td>
                    </tr>
                    <tr>
                      <th>Paid in Capital</th>
                      <td>{(balanceSheetData && balanceSheetData.paid_in_capital) || '0'}</td>
                    </tr>
                  </table>
                </div>
              </div>

              {/*stockName &&
                <div className="row buy-stock-data new-design">
                  <div className="col-md-6 stock-details-1">
                    <h5 className="heading-1">Stock Details</h5>
                    <p><span className="heading-0">Stock Name:</span> {stockDataById && stockDataById.stock_name}</p>
                    <p><span className="heading-0">Date Purchaged:</span>  {stockDataById && moment(stockDataById.buy_date).format('MM-DD-YYYY')}</p>
                    <p><span className="heading-0">Price:</span>  {stockDataById && stockDataById.price}</p>
                    <p><span className="heading-0">Live Price:</span>  {(stockDataById && stockDataById.live_price) || '-'}</p>
                    <p><span className="heading-0">Shares:</span>  {stockDataById && stockDataById.shares}</p>
                    <p><span className="heading-0">Note:</span> {(stockDataById && stockDataById.note) || 'N/A'}</p>
                    <p><span className="heading-0">Gain Percentage:</span> {(stockDataById && stockDataById.gain_percentage) || '-'}</p>
                    <p></p>
                    <p></p>
                  </div>
                </div>
              */}
            </div>
          </div>
        </div>
      </React.Fragment >
    )
  }
}

const enhance = compose(
  withRouter,
  withApollo
);

export default enhance(BalanceSheet);