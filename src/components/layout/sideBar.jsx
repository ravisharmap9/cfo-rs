import React, { Component } from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: null,
      userData: "",
    }
  }

  componentDidMount() {
    $(window).scrollTop(0);
  }

  // REDIRECT TO MY STOCK PAGE
  myStock(e) {
    e.preventDefault();
    this.props.history.push('/my-stocks');
  }
  // REDIRECT TO BUY STOCK PAGE
  buyStock(e) {
    e.preventDefault();
    this.props.history.push('/buy-stocks');
  }
  // REDIRECT TO SELL STOCK PAGE
  SellStock(e) {
    e.preventDefault();
    this.props.history.push('/sell-stocks');
  }
  // REDIRECT TO WATCH LIST STOCK PAGE
  watchList(e) {
    e.preventDefault();
    this.props.history.push('/watch-list-stocks');
  }

  //REDIRECT TO FINANCIAL LEDGER PAGE
  ledger(e) {
    e.preventDefault();
    this.props.history.push('/financials-ledger');
  }
  //REDIRECT TO INCOME STATEMENT PAGE
  incomeStatement(e) {
    e.preventDefault();
    this.props.history.push('/income-statement');
  }
  //REDIRECT TO JOURNAL ENTERY PAGE
  journalEntery(e) {
    e.preventDefault();
    this.props.history.push('/journal-entry');
  }
  //REDIRECT TO BALANCE SHEET PAGE
  balanceSheet(e) {
    e.preventDefault();
    this.props.history.push('/balance-sheet');
  }
  //REDIRECT TO FINANCIAL SHEET PAGE
  financialSheet(e) {
    e.preventDefault();
    this.props.history.push('/financial-statement');
  }


  render() {
    const pageUrl = this.props.location.pathname;
    let myStockActive, buyStockActive, sellStockActive, watchListActive, ledgerActive, incomeStatementActive,
      balanceSheetActive,
      //  journalEntryActive, 
      financialStatementActive;

    if (pageUrl.includes('/my-stocks')) {
      myStockActive = 'active';
    }

    if (pageUrl.includes('/buy-stocks')) {
      buyStockActive = 'active';
    }

    if (pageUrl.includes('/sell-stocks')) {
      sellStockActive = 'active';
    }

    if (pageUrl.includes('/watch-list-stocks')) {
      watchListActive = 'active';
    }

    if (pageUrl.includes('/financials-ledger')) {
      ledgerActive = 'active';
    }

    if (pageUrl.includes('/income-statement')) {
      incomeStatementActive = 'active';
    }

    if (pageUrl.includes('/balance-sheet')) {
      balanceSheetActive = 'active';
    }

    // if (pageUrl.includes('/journal-entry')) {
    //   journalEntryActive = 'active';
    // }

    if (pageUrl.includes('/financial-statement')) {
      financialStatementActive = 'active';
    }

    return (
      <React.Fragment>
        <div className="col-md-3 left_info">
          <div className="leftbar">
            <h5> MY Accounts</h5>
          </div>
          <div className="stock">
            <h4>Stock</h4>
            <ul>
              <li className={myStockActive}><a href="#/" onClick={(e) => this.myStock(e)}>My Stocks</a></li>
              <li className={buyStockActive}><a href="#/" onClick={(e) => this.buyStock(e)}>Buy Stocks</a></li>
              <li className={sellStockActive}><a href="#/" onClick={(e) => this.SellStock(e)}>Sell Stocks</a></li>
              <li className={watchListActive}><a href="#/" onClick={(e) => this.watchList(e)}>Watchlist</a></li>
            </ul>
          </div>
          <div className="stock">
            <h4>REITs</h4>
            <ul>
              <li><a href="#/">Buy REITs</a>
              </li>
              <li><a href="#/">Sell REITs</a>
              </li>
              <li><a href="#/">MY REITs</a>
              </li>
              <li><a href="#/">Watchlist</a>
              </li>
            </ul>
          </div>
          <div className="stock">
            <h4>Financials</h4>
            <ul>
              <li className={ledgerActive}><a href="#/" onClick={(e) => this.ledger(e)}>Ledger</a></li>
              <li className={incomeStatementActive}><a href="#/" onClick={(e) => this.incomeStatement(e)}>Income Statement</a></li>
              <li className={balanceSheetActive}><a href="#/" onClick={(e) => this.balanceSheet(e)}>Balance sheet</a></li>
              {/* <li className={journalEntryActive}><a href="#/" onClick={(e) => this.journalEntery(e)}>Journal Entry</a></li> */}
              <li className={financialStatementActive}><a href="#/" onClick={(e) => this.financialSheet(e)}>Financial Statement</a></li>
            </ul>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const enhance = compose(withRouter);
export default enhance(Sidebar);
