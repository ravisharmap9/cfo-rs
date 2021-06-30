import React, { Component } from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';
import _ from 'lodash';
import UserUtils from '../utilities/UserUtils';
import SideBar from '../layout/sideBar';
import * as commonFunctions from '../utilities/commonFunctions';
import { withApollo } from "react-apollo";
import { loader } from "graphql.macro";
import { DatetimePickerTrigger } from 'rc-datetime-picker';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
const SEARCH_STOCK = loader('../../graphql/stock/searchStock.graphql');
const ADD_USER_STOCK = loader('../../graphql/stock/addUserStock.graphql');
const GET_USER_STOCK = loader('../../graphql/stock/getUserStock.graphql');
const GET_STOCK_PRICE_BY_DATE = loader('../../graphql/stock/getStockPrizeByDate.graphql');
const BUY_USER_STOCK = loader('../../graphql/stock/buyUserStock.graphql');
const WATCHLIST_USER_STOCK = loader('../../graphql/stock/watchlistUserStock.graphql');

class MyStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      error: null,
      searchStock: "",
      searchStockData: "",
      selectedStock: "",
      dropDown: false,
      stockName: '',
      stockCode: '',
      getUserStockData: [],
      StockDate: moment(),
      minDateRange: '',
      maxDateRange: moment(new Date()),
      stockError: null,
      stockSuccess: null
    }
  }

  //HANDLE DATE SELECTION AND GET THE PRICE OF A STOCK BASED ON DATE
  handleStockDate(e, index) {
    this.setState({ StockDate: e });
    let newValue = e.format('MM-DD-YYYY');
    let values = [...this.state.getUserStockData];
    values[index].buy_date = newValue;
    // values[index].stockDate = e;
    $("#loadingDiv").show();
    this.props.client.query({
      query: GET_STOCK_PRICE_BY_DATE,
      variables: {
        'date': e.format('YYYY-MM-DD'),
        'stock_code': values[index].stock_code
      },
      fetchPolicy: "network-only"
    }).then(response => {
      if (response.data.getStockPriceByDate && response.data.getStockPriceByDate.price !== null && response.data.getStockPriceByDate.price !== "-") {
        values[index].tempPrice = response.data.getStockPriceByDate.price !== null ? parseFloat(response.data.getStockPriceByDate.price.replace(',', '')) : 0;
        values[index].price = response.data.getStockPriceByDate.price !== null ? parseFloat(response.data.getStockPriceByDate.price.replace(',', '')) : 0;
        this.setState({ values });
        $("#loadingDiv").hide();
      } else {
        $("#loadingDiv").hide();
        this.setState({ stockError: 'Price not avialable on the selected date. Please Check with other date.' });
        this.removeMsg();
        values[index].price = 0;
        this.setState({ values });
      }
    }).catch(error => {
      let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
      this.setState({ error: errorMsg });
      values[index].price = 0;
      this.setState({ values });
      $("#loadingDiv").hide();
    });
  };

  //HANDLE SHARE COUNT VALUES AND CALCULATE THE PRICE VALUE 
  handleSharesCount(e, index) {
    let values = [...this.state.getUserStockData];
    let newValue = e.target.value.replace(/[\D\s_]+/g, "");
    newValue = newValue !== "" ? parseInt(newValue) : "";
    values[index].shares = newValue;
    if (newValue !== '') {
      const priceVal = values[index].shares * values[index].tempPrice;
      if (priceVal) {
        values[index].price = priceVal.toFixed(3).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    }
    this.setState({ values });
  }

  // HANDLE THE NOTES OF A STOCK
  handleNote(e, index) {
    let values = [...this.state.getUserStockData];
    let newValue = e.target.value;
    values[index].note = newValue;
    this.setState({ values });
  }

  // SUBMIT METHOD TO BUY STOCK
  sumitBuyStock(e, index) {
    const stockData = this.state.getUserStockData[index];
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
        mutation: BUY_USER_STOCK,
        variables: {
          "user_stock_id": stockData.id,
          "price": stockData.price,
          "share": stockData.shares,
          "note": stockData.note,
          "buy_date": moment(stockData.buy_date).format('YYYY-MM-DD'),
        }
      }).then(response => {
        if (response.data.buyUserStock.status === 'SUCCESS') {
          this.setState({
            stockSuccess: response.data.buyUserStock.message,
          });
          $('#note' + index).val('');
          this.getUserStockData();
          this.removeMsg();
          $("#loadingDiv").hide();
        }
      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        this.setState({ stockError: errorMsg });
        $("#loadingDiv").hide();
      });
    }
  }

  // SUBMTI METHOD TO ADD A STOCK IN WATCHLIST
  sumitWatchlistStock(e, index) {
    const stockData = this.state.getUserStockData[index];
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
        mutation: WATCHLIST_USER_STOCK,
        variables: {
          "user_stock_id": stockData.id,
          "price": stockData.price,
          "share": stockData.shares,
          "note": stockData.note,
          "buy_date": moment(stockData.buy_date).format('YYYY-MM-DD'),
        }
      }).then(response => {
        if (response.data.watchlistUserStock.status === 'SUCCESS') {
          this.setState({
            stockSuccess: response.data.watchlistUserStock.message,
          });
          $('#note' + index).val('');
          this.getUserStockData();
          setTimeout(() => {
            this.setState({ stockError: null, stockSuccess: null });
          }, 5000);

          $("#loadingDiv").hide();
        }
      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        this.setState({ stockError: errorMsg });
        $("#loadingDiv").hide();
      });
    }
  }

  removeMsg() {
    setTimeout(() => {
      this.setState({ stockError: null, stockSuccess: null });
    }, 7000)
  }

  componentDidMount() {
    $(window).scrollTop(0);
    $("#loadingDiv").show();
    let token = UserUtils.getAccessToken();
    if (_.isEmpty(token)) {
      this.props.history.push('/');
    } else {
      this.getUserStockData();
      // TO SET THE MINIMUM DATE RANGE
      let currDate = new Date();
      currDate.setMonth(currDate.getMonth() - 3);
      this.setState({
        minDateRange: moment(currDate.toLocaleDateString())
      })
    }
  }

  // TO GET THE USER STOCKS
  getUserStockData() {
    this.props.client.query({
      query: GET_USER_STOCK,
      fetchPolicy: "network-only"
    }).then(response => {
      if (response.data.getUserStock) {
        this.setState({
          getUserStockData: response.data.getUserStock,
        });
        $("#loadingDiv").hide();
      }
    }).catch(error => {
      let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
      this.setState({ error: errorMsg });
      $("#loadingDiv").hide();
    });
  }

  //SEARCH STOCK METHOD
  handleSearch(e) {
    this.setState({ searchStock: e.target.value, error: null, success: null });
    const searchKey = e.target.value;
    if (searchKey.length >= 3) {
      $("#loadingDiv").show();
      this.props.client.query({
        query: SEARCH_STOCK,
        variables: {
          keyword: e.target.value
        },
        fetchPolicy: "network-only"
      }).then(response => {
        if (response.data.searchStock && response.data.searchStock.length > 0) {
          this.setState({
            searchStockData: response.data.searchStock,
            dropDown: true,
            error: null
          });
          $("#loadingDiv").hide();
        } else {
          this.setState({
            searchStockData: response.data.searchStock,
            error: 'Stocks Not Found',
            dropDown: false
          });
          $("#loadingDiv").hide();
        }

      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        console.log(errorMsg);
      });
    } else {
      this.setState({ dropDown: false });
    }
  }

  //SELECT STOCK METHOD
  selectStock(item) {
    this.setState({
      searchStock: item.name,
      dropDown: false,
      stockName: item.name,
      stockCode: item.code
    });
  }

  // ADD STOCK SUBMIT METHOD
  AddStock() {
    let { stockCode, stockName } = this.state;
    this.setState({ error: null });
    if (stockCode !== '' && stockName !== '') {
      $("#loadingDiv").show();
      this.props.client.mutate({
        mutation: ADD_USER_STOCK,
        variables: {
          "stock_name": stockName,
          "stock_code": stockCode,
        }
      }).then(response => {
        if (response.data.addUserStock.status === 'SUCCESS') {
          this.setState({
            success: response.data.addUserStock.message,
            selectedStock: '',
            searchStock: '',
            dropDown: false,
            stockName: '',
            stockCode: '',
          });
          this.getUserStockData();
          setTimeout(() => {
            this.setState({ error: null, success: null });
          }, 7000);
          $("#loadingDiv").hide();
        }
      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        this.setState({ error: errorMsg });
        $("#loadingDiv").hide();
      });
    } else {
      this.setState({ error: 'Please search stock and select your stock' });
    }
  }

  render() {
    let {
      searchStock,
      searchStockData,
      // selectedStock,
      dropDown,
      error,
      success,
      getUserStockData,
      StockDate,
      minDateRange,
      maxDateRange,
      stockError,
      stockSuccess
    } = this.state;

    return (
      <React.Fragment>
        <div className="row">
          <SideBar />
          <div className="col-md-9 right_info buy-stock-page">
            <div className=" col-md-12 bradcomes">
              <p>Home&nbsp;/&nbsp;Dashboard</p>
              <h4>MY STOCKS</h4>
              <div className="row">
                {error && (
                  <div className="error-msg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="success-msg text-success">
                    {success}
                  </div>
                )}
                <div className="col-md-9 wach_info">
                  <div className="form-group has-search"> <span className="fa fa-search form-control-feedback"></span>
                    <input
                      autoComplete="off"
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      name="searchStock"
                      value={searchStock}
                      onChange={(e) => this.handleSearch(e)}
                    />
                    {(dropDown) && (
                      <ul className="list">
                        <Scrollbars autoHeight autoHeightMax={350}>
                          {searchStockData.map(item => (
                            <li className="stock-name" onClick={() => this.selectStock(item)}>{item.name}</li>
                          ))}
                        </Scrollbars>
                      </ul>
                    )}

                  </div>
                </div>
                <div className="col-md-3 wach_info">
                  <button className="btn btn-primary" onClick={() => this.AddStock()}>Add</button>
                  {/* <button className="btn btn-default">Stock watchlist</button> */}
                </div>
              </div>
              <div className="buystocktable add-stock-table">
                <div className="">
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
                  <table className="table table-responsive" cellSpacing="0">
                    <thead>
                      <tr>
                        <th>STOCK</th>
                        <th>DATE</th>
                        <th>SHARES</th>
                        <th>PRICES</th>
                        <th>NOTE</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getUserStockData && getUserStockData.length === 0 && <tr><td colSpan="6" className="data-not-found text-center"><b >No Stocks Available</b></td></tr>}
                      {getUserStockData && getUserStockData.length > 0 && getUserStockData.map((d, index) => {
                        if (d.buy_date === null) {
                          d.buy_date = StockDate.format('MM-DD-YYYY');
                        }
                        return (
                          <tr key={index}>
                            <td className="heading">{d.stock_name || 'N/A'}</td>
                            <td className="date">
                              <DatetimePickerTrigger
                                closeOnSelectDay={true}
                                moment={StockDate}
                                showTimePicker={false}
                                minDate={minDateRange}
                                maxDate={maxDateRange}
                                onChange={(e) => this.handleStockDate(e, index)}>
                                <input
                                  className="form-control date-pic"
                                  type="text"
                                  value={d.buy_date}
                                />
                                <i class="fa fa-calendar stock-date" aria-hidden="true"></i>
                              </DatetimePickerTrigger>
                            </td>
                            <td className="number">
                              <input
                                disabled={d.price ? false : true}
                                className="form-control share-count"
                                type="text"
                                placeholder="0"
                                value={d.shares !== "0" ? d.shares : ''} onChange={(e) => this.handleSharesCount(e, index)}
                              />
                            </td>
                            <td className="note-1"><p className="form-control price">{d.price && d.price}</p></td>
                            <td className="note-0">
                              <input
                                id={`note${index}`}
                                type="text"
                                className="form-control note"
                                onChange={(e) => this.handleNote(e, index)}
                                value={d.note}
                              />
                            </td>
                            <td className="stock-btns">
                              <button className="btn btn-primary buy-stock-btn" onClick={(e) => this.sumitBuyStock(e, index)}>Buy Stock</button>&nbsp;
                              <button className="btn btn-primary watchlist-btnF" onClick={(e) => this.sumitWatchlistStock(e, index)} >Watchlist</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
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
export default enhance(MyStock);