import Layout from '../layout/layout';
import {
	HomePage,
	UpdatePassword,
	EditProfile,
	MyStock,
	BuyStock,
	SellStock,
	WatchList,
	AlertSetting,
	Ledger,
	IncomeStatement,
	JournalEntry,
	BalanceSheet,
	FinancialStatement

} from '../index';

export const publicRoutes = [
	{
		key: '/',
		exact: true,
		path: '/',
		component: HomePage,
		layout: Layout
	},
	{
		key: '/login',
		exact: true,
		path: '/login',
		component: HomePage,
		layout: Layout
	},
	{
		key: '/signup',
		exact: true,
		path: '/signup',
		component: HomePage,
		layout: Layout
	},
	{
		key: '/reset-password',
		exact: true,
		path: '/reset-password/:token',
		component: UpdatePassword,
		layout: Layout
	},
	{
		key: '/edit-profile',
		exact: true,
		path: '/edit-profile',
		component: EditProfile,
		layout: Layout
	},
	{
		key: '/my-stocks',
		exact: true,
		path: '/my-stocks',
		component: MyStock,
		layout: Layout
	},
	{
		key: '/buy-stocks',
		exact: true,
		path: '/buy-stocks',
		component: BuyStock,
		layout: Layout
	},
	{
		key: '/sell-stocks',
		exact: true,
		path: '/sell-stocks',
		component: SellStock,
		layout: Layout
	},
	{
		key: '/watch-list-stocks',
		exact: true,
		path: '/watch-list-stocks',
		component: WatchList,
		layout: Layout
	},
	{
		key: '/get-help',
		exact: true,
		path: '/get-help',
		component: AlertSetting,
		layout: Layout
	},
	{
		key: '/financials-ledger',
		exact: true,
		path: '/financials-ledger',
		component: Ledger,
		layout: Layout
	},
	{
		key: '/income-statement',
		exact: true,
		path: '/income-statement',
		component: IncomeStatement,
		layout: Layout
	},
	{
		key: '/journal-entry',
		exact: true,
		path: '/journal-entry',
		component: JournalEntry,
		layout: Layout
	},
	{
		key: '/balance-sheet',
		exact: true,
		path: '/balance-sheet',
		component: BalanceSheet,
		layout: Layout
	},
	{
		key: '/financial-statement',
		exact: true,
		path: '/financial-statement',
		component: FinancialStatement,
		layout: Layout
	},
];