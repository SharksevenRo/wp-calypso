/**
 * External Dependencies
 */
import { translate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import wp from 'lib/wp';
import {
	WP_SUPER_CACHE_DELETE_FILE,
	WP_SUPER_CACHE_DELETE_FILE_FAILURE,
	WP_SUPER_CACHE_DELETE_FILE_SUCCESS,
	WP_SUPER_CACHE_GENERATE_STATS,
	WP_SUPER_CACHE_GENERATE_STATS_FAILURE,
	WP_SUPER_CACHE_GENERATE_STATS_SUCCESS,
	WP_SUPER_CACHE_RECEIVE_STATS,
} from '../action-types';
import { errorNotice, removeNotice } from 'state/notices/actions';

/**
 * Returns an action object to be used in signalling that stats have been received.
 *
 * @param  {Number} siteId Site ID
 * @param  {Object} stats Stats object
 * @return {Object} Action object
 */
export const receiveStats = ( siteId, stats ) => ( { type: WP_SUPER_CACHE_RECEIVE_STATS, siteId, stats } );

/*
 * Retrieves stats for a site.
 *
 * @param  {Number} siteId Site ID
 * @returns {Function} Action thunk that requests stats for a given site
 */
export const generateStats = ( siteId ) => {
	return ( dispatch ) => {
		dispatch( {
			type: WP_SUPER_CACHE_GENERATE_STATS,
			siteId,
		} );

		return wp.req.get( { path: `/jetpack-blogs/${ siteId }/rest-api/` }, { path: '/wp-super-cache/v1/stats' } )
			.then( ( { data } ) => {
				dispatch( receiveStats( siteId, data ) );
				dispatch( {
					type: WP_SUPER_CACHE_GENERATE_STATS_SUCCESS,
					siteId,
				} );
			} )
			.catch( () => {
				dispatch( {
					type: WP_SUPER_CACHE_GENERATE_STATS_FAILURE,
					siteId,
				} );
			} );
	};
};

/*
 * Deletes a cached file for a site.
 *
 * @param  {Number} siteId Site ID
 * @param  {String} url URL of cached file to delete
 * @param  {Boolean} isSupercache Whether this is a supercache file
 * @param  {Boolean} isCached Whether this is a cached file
 * @returns {Function} Action thunk that deletes the cached file for a given site
 */
export const deleteFile = ( siteId, url, isSupercache, isCached ) => {
	return ( dispatch ) => {
		dispatch( removeNotice( 'wpsc-delete-cached-file' ) );
		dispatch( { type: WP_SUPER_CACHE_DELETE_FILE, siteId } );

		return wp.req.post(
			{ path: `/jetpack-blogs/${ siteId }/rest-api/` },
			{
				body: JSON.stringify( { url } ),
				json: true,
				path: '/wp-super-cache/v1/cache',
			} )
			.then( () => {
				dispatch( { type: WP_SUPER_CACHE_DELETE_FILE_SUCCESS, siteId, url, isSupercache, isCached } );
			} )
			.catch( () => {
				dispatch( errorNotice(
					translate( 'There was a problem deleting the cached file. Please try again.' ),
					{ id: 'wpsc-delete-cached-file' }
				) );
				dispatch( { type: WP_SUPER_CACHE_DELETE_FILE_FAILURE, siteId } );
			} );
	};
};
