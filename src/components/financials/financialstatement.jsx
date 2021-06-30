import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import compose from 'recompose/compose';
import UserUtils from '../utilities/UserUtils';
import * as commonFunctions from '../utilities/commonFunctions';
import SideBar from '../layout/sideBar';
import _ from 'lodash';
import $ from 'jquery';
import { loader } from "graphql.macro";
import Chart from "react-google-charts";
const GET_INCOME_SHEET = loader('../../graphql/financials/getIncomeStatement.graphql');
const GET_FINANCIAL_BALANCE_SHEET = loader('../../graphql/financials/getFinancialBalanceSheet.graphql');



class FinancialStatement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incomeStatementData: "",
      balanceSheetData: "",
    }
  }
  componentDidMount() {
    $(window).scrollTop(0);
    let userToken = UserUtils.getAccessToken();
    if (!_.isEmpty(userToken)) {
      $("#loadingDiv").show();
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

  render() {
    let {
      incomeStatementData,
      balanceSheetData
    } = this.state;


    // Cash start
    // Historical Values
    const _2h20 = parseFloat(balanceSheetData.paid_in_capital && -(parseFloat(balanceSheetData.paid_in_capital).toFixed(1)));
    const _1h20 = parseFloat(balanceSheetData.paid_in_capital && (parseFloat(_2h20) - ((15 / 100) * parseFloat(_2h20))).toFixed(1));
    const _2h19 = parseFloat(balanceSheetData.paid_in_capital && (parseFloat(_1h20) - ((15 / 100) * parseFloat(_1h20))).toFixed(1));
    const _1h19 = parseFloat(balanceSheetData.paid_in_capital && (parseFloat(_2h19) - ((15 / 100) * parseFloat(_2h19))).toFixed(1));
    const _2h18 = parseFloat(balanceSheetData.paid_in_capital && (parseFloat(_1h19) - ((15 / 100) * parseFloat(_1h19))).toFixed(1));
    const _1h18 = parseFloat(balanceSheetData.paid_in_capital && (parseFloat(_2h18) - ((15 / 100) * parseFloat(_2h18))).toFixed(1));
    //Projected Values
    const _1h21 = parseFloat(balanceSheetData.paid_in_capital && (((15 / 100) * parseFloat(_2h20)) + parseFloat(_2h20)).toFixed(1));
    const _2h21 = parseFloat(balanceSheetData.paid_in_capital && (((15 / 100) * parseFloat(_1h21)) + parseFloat(_1h21)).toFixed(1));
    const _1h22 = parseFloat(balanceSheetData.paid_in_capital && (((15 / 100) * parseFloat(_2h21)) + parseFloat(_2h21)).toFixed(1));
    const _2h22 = parseFloat(balanceSheetData.paid_in_capital && (((15 / 100) * parseFloat(_1h22)) + parseFloat(_1h22)).toFixed(1));
    const _1h23 = parseFloat(balanceSheetData.paid_in_capital && (((15 / 100) * parseFloat(_2h22)) + parseFloat(_2h22)).toFixed(1));
    const _2h23 = parseFloat(balanceSheetData.paid_in_capital && (((15 / 100) * parseFloat(_1h23)) + parseFloat(_1h23)).toFixed(1));
    /**Cash End */

    /**Investment Account start */
    // Historical Values
    const ia_2h20 = parseFloat(balanceSheetData.investment_account && parseFloat(balanceSheetData.investment_account).toFixed(1));
    const ia_1h20 = parseFloat(balanceSheetData.investment_account && (parseFloat(ia_2h20) - ((15 / 100) * parseFloat(ia_2h20))).toFixed(1));
    const ia_2h19 = parseFloat(balanceSheetData.investment_account && (parseFloat(ia_1h20) - ((15 / 100) * parseFloat(ia_1h20))).toFixed(1));
    const ia_1h19 = parseFloat(balanceSheetData.investment_account && (parseFloat(ia_2h19) - ((15 / 100) * parseFloat(ia_2h19))).toFixed(1));
    const ia_2h18 = parseFloat(balanceSheetData.investment_account && (parseFloat(ia_1h19) - ((15 / 100) * parseFloat(ia_1h19))).toFixed(1));
    const ia_1h18 = parseFloat(balanceSheetData.investment_account && (parseFloat(ia_2h18) - ((15 / 100) * parseFloat(ia_2h18))).toFixed(1));

    // Projected Values
    const ia_1h21 = parseFloat(balanceSheetData.investment_account && (((15 / 100) * parseFloat(ia_2h20)) + parseFloat(ia_2h20)).toFixed(1));
    const ia_2h21 = parseFloat(balanceSheetData.investment_account && (((15 / 100) * parseFloat(ia_1h21)) + parseFloat(ia_1h21)).toFixed(1));
    const ia_1h22 = parseFloat(balanceSheetData.investment_account && (((15 / 100) * parseFloat(ia_2h21)) + parseFloat(ia_2h21)).toFixed(1));
    const ia_2h22 = parseFloat(balanceSheetData.investment_account && (((15 / 100) * parseFloat(ia_1h22)) + parseFloat(ia_1h22)).toFixed(1));
    const ia_1h23 = parseFloat(balanceSheetData.investment_account && (((15 / 100) * parseFloat(ia_2h22)) + parseFloat(ia_2h22)).toFixed(1));
    const ia_2h23 = parseFloat(balanceSheetData.investment_account && (((15 / 100) * parseFloat(ia_1h23)) + parseFloat(ia_1h23)).toFixed(1));
    /**Investment Account ends */

    /**Fair value account start */
    // Historical Values
    const fa_2h20 = parseFloat(balanceSheetData.fair_value_account && parseFloat(balanceSheetData.fair_value_account).toFixed(1));
    const fa_1h20 = parseFloat(balanceSheetData.fair_value_account && (parseFloat(fa_2h20) - ((15 / 100) * parseFloat(fa_2h20))).toFixed(1));
    const fa_2h19 = parseFloat(balanceSheetData.fair_value_account && (parseFloat(fa_1h20) - ((15 / 100) * parseFloat(fa_1h20))).toFixed(1));
    const fa_1h19 = parseFloat(balanceSheetData.fair_value_account && (parseFloat(fa_2h19) - ((15 / 100) * parseFloat(fa_2h19))).toFixed(1));
    const fa_2h18 = parseFloat(balanceSheetData.fair_value_account && (parseFloat(fa_1h19) - ((15 / 100) * parseFloat(fa_1h19))).toFixed(1));
    const fa_1h18 = parseFloat(balanceSheetData.fair_value_account && (parseFloat(fa_2h18) - ((15 / 100) * parseFloat(fa_2h18))).toFixed(1));

    // Projected Values 
    const fa_1h21 = parseFloat(balanceSheetData.fair_value_account && (((15 / 100) * parseFloat(fa_2h20)) + ((parseFloat(fa_2h20)))).toFixed(1));
    const fa_2h21 = parseFloat(balanceSheetData.fair_value_account && (((15 / 100) * parseFloat(fa_1h21)) + parseFloat(fa_1h21)).toFixed(1));
    const fa_1h22 = parseFloat(balanceSheetData.fair_value_account && (((15 / 100) * parseFloat(fa_2h21)) + parseFloat(fa_2h21)).toFixed(1));
    const fa_2h22 = parseFloat(balanceSheetData.fair_value_account && (((15 / 100) * parseFloat(fa_1h22)) + parseFloat(fa_1h22)).toFixed(1));
    const fa_1h23 = parseFloat(balanceSheetData.fair_value_account && (((15 / 100) * parseFloat(fa_2h22)) + parseFloat(fa_2h22)).toFixed(1));
    const fa_2h23 = parseFloat(balanceSheetData.fair_value_account && (((15 / 100) * parseFloat(fa_1h23)) + parseFloat(fa_1h23)).toFixed(1));
    /**Investment Account ends */

    /**Piad in Capital  start */
    // Historical Values
    const pc_2h20 = parseFloat(balanceSheetData.paid_in_capital && parseFloat(balanceSheetData.paid_in_capital).toFixed(1));
    const pc_1h20 = parseFloat(balanceSheetData.paid_in_capital && (parseFloat(pc_2h20) - ((15 / 100) * parseFloat(pc_2h20))).toFixed(1));
    const pc_2h19 = parseFloat(balanceSheetData.paid_in_capital && (parseFloat(pc_1h20) - ((15 / 100) * parseFloat(pc_1h20))).toFixed(1));
    const pc_1h19 = parseFloat(balanceSheetData.paid_in_capital && (parseFloat(pc_2h19) - ((15 / 100) * parseFloat(pc_2h19))).toFixed(1));
    const pc_2h18 = parseFloat(balanceSheetData.paid_in_capital && (parseFloat(pc_1h19) - ((15 / 100) * parseFloat(pc_1h19))).toFixed(1));
    const pc_1h18 = parseFloat(balanceSheetData.paid_in_capital && (parseFloat(pc_2h18) - ((15 / 100) * parseFloat(pc_2h18))).toFixed(1));

    // Projected Values 
    const pc_1h21 = parseFloat(balanceSheetData.paid_in_capital && (((15 / 100) * parseFloat(pc_2h20)) + ((parseFloat(pc_2h20)))).toFixed(1));
    const pc_2h21 = parseFloat(balanceSheetData.paid_in_capital && (((15 / 100) * parseFloat(pc_1h21)) + parseFloat(pc_1h21)).toFixed(1));
    const pc_1h22 = parseFloat(balanceSheetData.paid_in_capital && (((15 / 100) * parseFloat(pc_2h21)) + parseFloat(pc_2h21)).toFixed(1));
    const pc_2h22 = parseFloat(balanceSheetData.paid_in_capital && (((15 / 100) * parseFloat(pc_1h22)) + parseFloat(pc_1h22)).toFixed(1));
    const pc_1h23 = parseFloat(balanceSheetData.paid_in_capital && (((15 / 100) * parseFloat(pc_2h22)) + parseFloat(pc_2h22)).toFixed(1));
    const pc_2h23 = parseFloat(balanceSheetData.paid_in_capital && (((15 / 100) * parseFloat(pc_1h23)) + parseFloat(pc_1h23)).toFixed(1));
    /**Investment Account ends */


    return (
      <React.Fragment>
        <div className="row">
          <SideBar />
          <div className="col-md-9 right_info stock-pages-data financial-statement-page">
            <div className=" col-md-12 bradcomes">
              <h4>Financial Statement Analysis</h4>
              <div className="row buy-stock-data">
                <div className="col-md-3 table-responsive">
                  <table className="table">
                    <tr>
                      <th className="heading-data" colSpan="2">Income Statement</th>
                    </tr>
                    <tr>
                      <th>Revenue</th>
                      <td>61,585</td>
                    </tr>
                    <tr>
                      <th >COGS</th>
                      <td>10,000</td>
                    </tr>
                    <tr>
                      <th>Gross Profit</th>
                      <td>51,585</td>
                    </tr>
                    <tr>
                      <th className="lab-equity" >All expenses</th>
                      <td>5000</td>
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
                <div className="col-md-9 table-responsive new-design">
                  <table className="table">
                    <tr className="f-heading">
                      <th colSpan="6" className="text-center-heading middle-section">Historical</th>
                      <th colSpan="6" className="text-center-heading">Projected</th>
                    </tr>
                    <tr className="f-heading">
                      <th>1H18</th>
                      <th>2H18</th>
                      <th>1H19</th>
                      <th>2H19</th>
                      <th>1H20</th>
                      <th className="middle-section">2H20</th>
                      <th>1H21</th>
                      <th>2H21</th>
                      <th>1H22</th>
                      <th>2H22</th>
                      <th>1H23</th>
                      <th>2H23</th>
                    </tr>
                    {/* Revenue */}
                    <tr className="f-table">
                      <td>$27,327</td>
                      <td>$32,149</td>
                      <td>$37,822</td>
                      <td>$44,496</td>
                      <td>$52,348</td>
                      <td className="middle-section">$61,585</td>
                      <td>$70,823</td>
                      <td>$81,446</td>
                      <td>$93,663</td>
                      <td>$107,712</td>
                      <td>$123,869</td>
                      <td>$142,449</td>
                    </tr>
                    {/* Cogs */}
                    <tr className="f-table">
                      <td>$4,438</td>
                      <td>$5,221</td>
                      <td>$6,142</td>
                      <td>$7,225</td>
                      <td>$8,500</td>
                      <td className="middle-section">$10,000</td>
                      <td>$11,500</td>
                      <td>$13225</td>
                      <td>$15,208</td>
                      <td>$17,489</td>
                      <td>$20,112</td>
                      <td>$23,128</td>
                    </tr>
                    {/* Gross Profit */}
                    <tr className="f-table">
                      <td>$22,890</td>
                      <td>$26,929</td>
                      <td>$31,681</td>
                      <td>$37,271</td>
                      <td>$43,848</td>
                      <td className="middle-section">$51,585</td>
                      <td>$59,322</td>
                      <td>$68,220</td>
                      <td>$78,453</td>
                      <td>$90,220</td>
                      <td>$103,753</td>
                      <td>$119,315</td>
                    </tr>
                    {/* All Expenses */}
                    <tr className="f-table">
                      <td>$2,221</td>
                      <td>$2,612</td>
                      <td>$3,072</td>
                      <td>$3,613</td>
                      <td>$4,250</td>
                      <td className="middle-section">$5,000</td>
                      <td>$5,750</td>
                      <td>$6,612</td>
                      <td>$7,603</td>
                      <td>$8,743</td>
                      <td>$10,054</td>
                      <td>$11,562</td>
                    </tr>

                  </table>
                </div>
              </div>
              <div className="graph-section">
                {balanceSheetData &&
                  <Chart
                    width={'85%'}
                    height={'450px'}
                    chartType="Line"
                    loader={<div>Loading Chart</div>}
                    data={[
                      ['Year', 'Revenue', 'COGS', 'Gross Profit', 'All Expenses'],
                      ['1H18', 27327, 4438, 22890, 2221],
                      ['2H18', 32149, 5221, 26929, 2612],
                      ['1H19', 37822, 6142, 31681, 3072],
                      ['2H19', 44496, 7225, 37271, 3613],
                      ['1H20', 52348, 8500, 43848, 4250],
                      ['2H20', 61585, 10000, 51585, 5000],
                      ['1H21', 70823, 11500, 59322, 5750],
                      ['2H21', 81446, 13225, 68220, 6612],
                      ['1H22', 93663, 15208, 78453, 7603],
                      ['2H22', 107712, 17489, 90220, 8743],
                      ['1H23', 123869, 20112, 103753, 10054],
                      ['2H23', 142449, 23128, 119315, 11562]
                    ]}
                    options={{
                      chart: {
                        title: 'Income Statement Graph',
                        subtitle: '',
                      },
                    }}
                    rootProps={{ 'data-testid': '5' }}
                  />
                }
              </div>
              <hr />
              <div className="row buy-stock-data ">
                <div className="col-md-3 table-responsive">
                  <table className="table">
                    <tr>
                      <th className="heading-data" colSpan="2">Balance Sheet</th>
                    </tr>
                    {/* <tr>
                      <th className="heading-data-1" colSpan="2">Asset</th>
                    </tr> */}
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
                      <td>{(balanceSheetData && parseFloat(balanceSheetData.fair_value_account).toFixed(3)) || '0'}</td>
                    </tr>
                    {/* <tr>
                      <th className="lab-equity" >Liab + Equity</th>
                      <td>{(balanceSheetData && balanceSheetData.lib_and_equity)}</td>
                    </tr> */}
                    <tr>
                      <th>Paid in Capital</th>
                      <td>{(balanceSheetData && balanceSheetData.paid_in_capital) || '0'}</td>
                    </tr>
                  </table>
                </div>
                <div className="col-md-9 table-responsive new-design">
                  {balanceSheetData &&
                    <table className="table" >
                      <tr className="f-heading">
                        <th colSpan="6" className="text-center-heading middle-section">Historical</th>
                        <th colSpan="6" className="text-center-heading">Projected</th>
                      </tr>
                      <tr className="f-heading">
                        <th>1H18</th>
                        <th>2H18</th>
                        <th>1H19</th>
                        <th>2H19</th>
                        <th>1H20</th>
                        <th className="middle-section">2H20</th>
                        <th>1H21</th>
                        <th>2H21</th>
                        <th>1H22</th>
                        <th>2H22</th>
                        <th>1H23</th>
                        <th>2H23</th>
                      </tr>
                      <tr className="f-table">
                        <td>${_1h18}</td>
                        <td>${_2h18}</td>
                        <td>${_1h19}</td>
                        <td>${_2h19}</td>
                        <td>${_1h20}</td>
                        <td className="middle-section">${_2h20}</td>
                        <td>${_1h21}</td>
                        <td>${_2h21}</td>
                        <td>${_1h22}</td>
                        <td>${_2h22}</td>
                        <td>${_1h23}</td>
                        <td>${_2h23}</td>
                      </tr>

                      <tr className="f-table">
                        <td>${ia_1h18}</td>
                        <td>${ia_2h18}</td>
                        <td>${ia_1h19}</td>
                        <td>${ia_2h19}</td>
                        <td>${ia_1h20}</td>
                        <td className="middle-section">${ia_2h20}</td>
                        <td>${ia_1h21}</td>
                        <td>${ia_2h21}</td>
                        <td>${ia_1h22}</td>
                        <td>${ia_2h22}</td>
                        <td>${ia_1h23}</td>
                        <td>${ia_2h23}</td>
                      </tr>

                      <tr className="f-table">
                        <td>${fa_1h18}</td>
                        <td>${fa_2h18}</td>
                        <td>${fa_1h19}</td>
                        <td>${fa_2h19}</td>
                        <td>${fa_1h20}</td>
                        <td className="middle-section">${fa_2h20}</td>
                        <td>${fa_1h21}</td>
                        <td>${fa_2h21}</td>
                        <td>${fa_1h22}</td>
                        <td>${fa_2h22}</td>
                        <td>${fa_1h23}</td>
                        <td>${fa_2h23}</td>
                      </tr>

                      <tr className="f-table">
                        <td>${pc_1h18}</td>
                        <td>${pc_2h18}</td>
                        <td>${pc_1h19}</td>
                        <td>${pc_2h19}</td>
                        <td>${pc_1h20}</td>
                        <td className="middle-section">${pc_2h20}</td>
                        <td>${pc_1h21}</td>
                        <td>${pc_2h21}</td>
                        <td>${pc_1h22}</td>
                        <td>${pc_2h22}</td>
                        <td>${pc_1h23}</td>
                        <td>${pc_2h23}</td>
                      </tr>
                    </table>
                  }
                </div>
              </div>
              <div className="graph-section">
                {balanceSheetData &&
                  <Chart
                    width={'85%'}
                    height={'450px'}
                    chartType="Line"
                    loader={<div>Loading Chart</div>}
                    data={[
                      ['Year', 'Cash', 'Investment Account', 'Fair value account', 'Paid in Capital'],
                      ['1H18', _1h18, ia_1h18, fa_1h18, pc_1h18],
                      ['2H18', _2h18, ia_2h18, fa_2h18, pc_2h18],
                      ['1H19', _1h19, ia_1h19, fa_1h19, pc_1h19],
                      ['2H19', _2h19, ia_2h19, fa_2h19, pc_2h19],
                      ['1H20', _1h20, ia_1h20, fa_1h20, pc_1h20],
                      ['2H20', _2h20, ia_2h20, fa_2h20, pc_2h20],
                      ['1H21', _1h21, ia_1h21, fa_1h21, pc_1h21],
                      ['2H21', _2h21, ia_2h21, fa_2h21, pc_2h21],
                      ['1H22', _1h22, ia_1h22, fa_1h22, pc_1h22],
                      ['2H22', _2h22, ia_2h22, fa_2h22, pc_2h22],
                      ['1H23', _1h23, ia_1h23, fa_1h23, pc_1h23],
                      ['2H23', _2h23, ia_2h23, fa_2h23, pc_2h23]
                    ]}
                    options={{
                      chart: {
                        title: 'Balance Sheet Graph',
                        subtitle: '',
                      },
                    }}
                    rootProps={{ 'data-testid': '2' }}
                  />
                }
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

export default enhance(FinancialStatement);