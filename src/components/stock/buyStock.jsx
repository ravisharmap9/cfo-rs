import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as commonFunctions from '../utilities/commonFunctions';
import { loader } from "graphql.macro";
import compose from 'recompose/compose';
import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import UserUtils from '../utilities/UserUtils';
import SideBar from '../layout/sideBar';
import { Scrollbars } from 'react-custom-scrollbars';
const GET_BUY_STOCKS = loader('../../graphql/stock/getBuyStocks.graphql');
const SELL_USER_STOCK = loader('../../graphql/stock/sellUserStock.graphql');

class BuyStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      error: null,
      getStockData: [],
      stockError: null,
      stockSuccess: null
    }
  }

  componentDidMount() {
    $(window).scrollTop(0);
    $("#loadingDiv").show();
    let token = UserUtils.getAccessToken();
    if (_.isEmpty(token)) {
      this.props.history.push('/');
    } else {
      this.getUserStockData();
    }
  }

  // TO GET THE USER STOCKS
  getUserStockData() {
    this.props.client.query({
      query: GET_BUY_STOCKS,
      fetchPolicy: "network-only"
    }).then(response => {
      if (response.data.getUserBuyStock) {
        this.setState({
          getStockData: response.data.getUserBuyStock,
        });
        $("#loadingDiv").hide();
      }
    }).catch(error => {
      let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
      this.setState({ error: errorMsg });
      $("#loadingDiv").hide();
    });
  }

  removeMsg() {
    setTimeout(() => {
      this.setState({ stockError: null, stockSuccess: null });
    }, 7000)
  }

  // SUBMIT METHOD TO SELL THE STOCK
  sumitSellStock(e, stockData, index) {
    if (stockData.price === null) {
      this.setState({ stockError: 'Please select Date.' });
      this.removeMsg();
    } else if (stockData.shares === "0") {
      this.setState({ stockError: 'Please Enter shares count.' });
      this.removeMsg();
    } else if (stockData.note === '') {
      this.setState({ stockError: 'Please enter Note.' });
      this.removeMsg();
    } else {
      $("#loadingDiv").show();
      this.props.client.mutate({
        mutation: SELL_USER_STOCK,
        variables: {
          "user_stock_id": stockData.id,
          "price": stockData.price,
          "share": stockData.shares,
          "note": stockData.note,
        }
      }).then(response => {
        if (response.data.sellUserStock.status === 'SUCCESS') {
          this.setState({
            stockSuccess: response.data.sellUserStock.message,
          });
          $('#note' + index).val('');
          this.getUserStockData();
          this.removeMsg();
          setTimeout(() => {
            $("#loadingDiv").hide();
          }, 700);
        }
      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        this.setState({ stockError: errorMsg });
        this.removeMsg();
        $("#loadingDiv").hide();
      });
    }
  }

  render() {
    let { getStockData, stockError, stockSuccess } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          <SideBar />
          <div className="col-md-9 right_info stock-pages-data">
            <div className=" col-md-12 bradcomes">
              <h4>BUY STOCKS</h4>
              <div className="table-responsive ">
                {stockError && (
                  <div className="error-msg">
                    {stockError}
                  </div>
                )}
                {stockSuccess && (
                  <div className="success-msg text-success">
                    {stockSuccess}
                  </div>
                )}
                <Scrollbars autoHeight autoHeightMax={530}>
                  <table id="mytable" className="table table-bordred table-striped">
                    <thead>
                      <tr>
                        <th>stock</th>
                        <th>Live price</th>
                        <th>quantity</th>
                        <th>Date purchaged</th>
                        <th>gain%</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStockData && getStockData.length === 0 && <tr><td colSpan="6" className="data-not-found text-center"><b >No Stocks Available</b></td></tr>}
                      {getStockData && getStockData.length > 0 && getStockData.map((d, index) => {
                        return (
                          <tr key={index}>
                            <td>{d.stock_name || '-'}</td>
                            <td className="sucess">{d.live_price || '-'}</td>
                            <td>{d.shares || '-'}</td>
                            <td>{d.buy_date && moment(d.buy_date).format('MM-DD-YYYY')}</td>
                            <td>{d.gain_percentage || '-'}</td>
                            <td className="stock-btns">
                              <button className="btn btn-primary sell-stock-btn" onClick={(e) => this.sumitSellStock(e, d, index)}>Sell Stock</button>&nbsp;
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </Scrollbars>
              </div>
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
export default enhance(BuyStock);