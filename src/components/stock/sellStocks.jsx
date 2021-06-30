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
import { Scrollbars } from 'react-custom-scrollbars';
const GET_SET_STOCKS = loader('../../graphql/stock/getSellStocks.graphql');

class SellStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      error: null,
      getStockData: [],
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
      query: GET_SET_STOCKS,
      fetchPolicy: "network-only"
    }).then(response => {
      if (response.data.getUserSellStock) {
        this.setState({
          getStockData: response.data.getUserSellStock,
        });
        $("#loadingDiv").hide();
      }
    }).catch(error => {
      let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
      this.setState({ error: errorMsg });
      $("#loadingDiv").hide();
    });
  }

  render() {
    let { getStockData } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          <SideBar />
          <div className="col-md-9 right_info stock-pages-data">
            <div className=" col-md-12 bradcomes">
              <h4>SELL STOCKS</h4>
              <div className="table-responsive">
                <Scrollbars autoHeight autoHeightMax={530}>
                  <table id="mytable" className="table table-bordred table-striped">
                    <thead>
                      <tr>
                        <th>stock</th>
                        <th>Live price</th>
                        <th>quantity</th>
                        <th>Date Sold</th>
                        <th>gain%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStockData && getStockData.length === 0 && <tr><td colSpan="5" className="data-not-found text-center"><b >No Stocks Available</b></td></tr>}
                      {getStockData && getStockData.length > 0 && getStockData.map((d, index) => {
                        return (
                          <tr key={index}>
                            <td>{d.stock_name || '-'}</td>
                            <td className="sucess">{d.live_price || '-'}</td>
                            <td>{d.shares || '-'}</td>
                            <td>{(d.sell_date && moment(d.sell_date).format('MM-DD-YYYY')) || '-'}</td>
                            <td>{d.gain_percentage || '-'}</td>
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
export default enhance(SellStock);