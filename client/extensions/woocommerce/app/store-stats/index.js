/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import Navigation from './store-stats-navigation';
import { getSelectedSiteId } from 'state/ui/selectors';
import Chart from './store-stats-chart';
import StatsModule from 'my-sites/stats/stats-module';

class StoreStats extends Component {
	static propTypes = {
		siteId: PropTypes.number,
		unit: PropTypes.string.isRequired,
		startDate: PropTypes.string,
		path: PropTypes.string.isRequired,
	};

	render() {
		const { siteId, unit, startDate, path } = this.props;
		const today = this.props.moment().format( 'YYYY-MM-DD' );
		const selectedDate = startDate || today;
		const ordersQuery = {
			unit,
			date: today,
			quantity: '30'
		};
		const topSellersQuery = {
			unit,
			date: selectedDate,
			quantity: '7',
			limit: '3',
		};
		const translate = this.props.translate;
		const moduleStrings = {
			title: translate( 'Products', { context: 'Stats: title of module' } ),
			item: translate( 'Title', { context: 'Stats: module row header for product title.' } ),
			value: translate( 'Qty', { context: 'Stats: module row header for number of products sold.' } ),
			values: [
				{ value: translate( 'Qty', { context: 'Stats: module row header for number of products sold.' } ) },
				{ value: translate( 'Total', { context: 'Stats: module row header for total amount sold.' } ) },
			],
			empty: translate( 'No products found', { context: 'Stats: Info box label when the Products module is empty' } )
		};
		return (
			<Main className="store-stats woocommerce" wideLayout={ true }>
				<Navigation unit={ unit } type="orders" />
				<Chart
					path={ path }
					query={ ordersQuery }
					selectedDate={ selectedDate }
					siteId={ siteId }
					unit={ unit }
				/>
				<div className="store-stats__module stats__module-column">
					<StatsModule
						path="top-sellers"
						moduleStrings={ moduleStrings }
						period={ { period: unit } }
						query={ topSellersQuery }
						statType="statsTopSellers"
						showSummaryLink
					/>
				</div>
			</Main>
		);
	}
}

const localizedStats = localize( StoreStats );

export default connect(
	state => {
		return {
			siteId: getSelectedSiteId( state ),
		};
	}
)( localizedStats );
