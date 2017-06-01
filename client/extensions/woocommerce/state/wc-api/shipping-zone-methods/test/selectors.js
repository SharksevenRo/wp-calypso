/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	getShippingZoneMethod,
	areShippingZoneMethodsLoaded,
	areShippingZoneMethodsLoading,
} from '../selectors';
import { LOADING } from 'woocommerce/state/wc-api/reducer';

describe( 'selectors', () => {
	describe( 'get shipping zone method', () => {
		it( 'when shipping zone method does not exist', () => {
			const state = {
				extensions: {
					woocommerce: {
						wcApi: {
							123: {
								shippingZoneMethods: {},
							},
						},
					},
				},
			};

			expect( getShippingZoneMethod( state, 17, 123 ) ).to.be.falsey;
		} );

		it( 'when shipping zone method exists', () => {
			const state = {
				extensions: {
					woocommerce: {
						wcApi: {
							123: {
								shippingZoneMethods: {
									17: { id: 17, method_id: 'free_shipping' },
								},
							},
						},
					},
				},
			};

			expect( getShippingZoneMethod( state, 17, 123 ) ).to.deep.equal( { id: 17, method_id: 'free_shipping' } );
		} );
	} );

	describe( 'shipping zone methods loading state', () => {
		it( 'when some zone methods are still loading.', () => {
			const state = {
				extensions: {
					woocommerce: {
						wcApi: {
							123: {
								shippingZones: [
									{ id: 1, methodIds: LOADING },
									{ id: 2, methodIds: [ 7, 42 ] },
								]
							},
						},
					},
				},
			};

			expect( areShippingZoneMethodsLoaded( state, 1, 123 ) ).to.be.false;
			expect( areShippingZoneMethodsLoading( state, 1, 123 ) ).to.be.true;
			expect( areShippingZoneMethodsLoaded( state, 2, 123 ) ).to.be.true;
			expect( areShippingZoneMethodsLoading( state, 2, 123 ) ).to.be.false;
		} );
	} );
} );
