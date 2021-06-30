import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as commonFunctions from '../utilities/commonFunctions';
import { loader } from "graphql.macro";
import compose from 'recompose/compose';
import $ from 'jquery';
import _ from 'lodash';
import UserUtils from '../utilities/UserUtils';
import SideBar from '../layout/sideBar';
import moment from 'moment';
const GET_WISH_LIST_STOCKS = loader('../../graphql/stock/getWatchlistStocks.graphql');
const REMOVE_STOCKS = loader('../../graphql/stock/removeStocks.graphql');

class WishListStocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      error: null,
      getUserStocksData: [],
      selectedCheckData: [],
    }
  }

  componentDidMount() {
    $(window).scrollTop(0);
    $("#loadingDiv").show();
    let token = UserUtils.getAccessToken();
    if (_.isEmpty(token)) {
      this.props.history.push('/');
    } else {
      this.getStocksData();
    }
  }

  // TO GET THE USER STOCKS
  getStocksData() {
    this.props.client.query({
      query: GET_WISH_LIST_STOCKS,
      fetchPolicy: "network-only"
    }).then(response => {
      if (response.data.getUserWishlistStock) {
        this.setState({
          getUserStocksData: response.data.getUserWishlistStock,
        });
        $("#loadingDiv").hide();
      }

    }).catch(error => {
      let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
      this.setState({ error: errorMsg });
      $("#loadingDiv").hide();
    });
  }

  handleSelectOneCheckBox(e, stockId) {
    let { selectedCheckData } = this.state;
    const selectedIndex = selectedCheckData.indexOf(stockId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCheckData, stockId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedCheckData.slice(1));
    } else if (selectedIndex === selectedCheckData.length - 1) {
      newSelected = newSelected.concat(selectedCheckData.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedCheckData.slice(0, selectedIndex),
        selectedCheckData.slice(selectedIndex + 1),
      );
    }
    this.setState({ selectedCheckData: newSelected });
  }

  removeStocks() {
    let { selectedCheckData } = this.state;
    if (selectedCheckData.length === 0) {
      this.setState({ error: 'Please select at least one stock from stock list to remove.' });
      this.removeErrors();
    } else {
      $("#loadingDiv").show();
      this.props.client.mutate({
        mutation: REMOVE_STOCKS,
        variables: { "id": selectedCheckData }
      }).then(response => {
        if (response.data.removeUserWishlist.status === 'SUCCESS') {
          this.setState({
            success: response.data.removeUserWishlist.message,
            selectedCheckData: []
          });
          this.getStocksData();
          this.removeErrors();
          $("#loadingDiv").hide();
        } else {
          this.setState({
            error: response.data.removeUserWishlist.message,
            selectedCheckData: []
          });
          this.removeErrors();
          $("#loadingDiv").hide();
        }
      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        this.setState({ error: errorMsg });
        $("#loadingDiv").hide();
      });
    }
  }

  removeErrors() {
    setTimeout(() => {
      this.setState({ error: null, success: null });
    }, 7000);
  }

  render() {
    let { getUserStocksData, selectedCheckData, success, error } = this.state;
    const isSelected = name => selectedCheckData ? selectedCheckData.indexOf(name) !== -1 : '';
    return (
      <React.Fragment>
        <div className="row">
          <SideBar />
          <div className="col-md-9 right_info stock-pages-data">
            <div className=" col-md-12 bradcomes">
              <h4>WATCH LIST STOCKS</h4>
              <div className="table-responsive">
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
                <table id="mytable" className="table table-bordred table-striped">
                  <thead>
                    <tr>
                      <th>stock</th>
                      <th>Live price</th>
                      <th>quantity</th>
                      <th>Date purchaged</th>
                      <th>gain%</th>
                      <th className="remove"><button disabled={(getUserStocksData && getUserStocksData.length === 0) ? true : false} className="btn btn-danger btn-remove" onClick={(e) => this.removeStocks()}>Remove</button></th>
                    </tr>
                  </thead>
                  <tbody>
                    {getUserStocksData && getUserStocksData.length === 0 && <tr><td colSpan="6" className="data-not-found text-center"><b >No Stocks Available</b></td></tr>}
                    {getUserStocksData && getUserStocksData.length > 0 && getUserStocksData.map((d, index) => {
                      const isItemSelected = isSelected(d.id);
                      return (
                        <tr key={index}>
                          <td>{d.stock_name || '-'}</td>
                          <td className="sucess">{d.live_price || '-'}</td>
                          <td>{d.shares || '-'}</td>
                          <td>{(d.buy_date && moment(d.buy_date).format('MM-DD-YYYY')) || '-'}</td>
                          <td>{d.gain_percentage || '-'}</td>
                          <td>
                            <input className="form-control wish-list-check" id='two' type='checkbox' value={d.id} checked={isItemSelected ? true : false} onChange={(e) => this.handleSelectOneCheckBox(e, d.id)} />
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
      </React.Fragment >
    )
  }
}

const enhance = compose(
  withRouter,
  withApollo
);
export default enhance(WishListStocks);