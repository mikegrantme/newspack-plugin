/**
 * External dependencies.
 */
import { stringify } from 'qs';
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { Spinner } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import { withWizardScreen, Notice } from '../../../../components/src';
import Filters from './Filters';
import Chart from './Chart';
import Info from './Info';
import './style.scss';
import { useFiltersState, useAnalyticsState } from './utils';

/**
 * Popups Analytics screen.
 */
const PopupAnalytics = () => {
	const [ hasFetchedOnce, setHasFetchedOnce ] = useState( false );
	const [ error, setError ] = useState();
	const [ isRefetching, setIsRefetching ] = useState( false );
	const [ filtersState, dispatchFilter ] = useFiltersState();
	const [ state, updateState ] = useAnalyticsState();
	const { report, labels, actions, key_metrics, post_edit_link } = state;

	useEffect( () => {
		setIsRefetching( true );
		apiFetch( { path: `/newspack/v1/popups-analytics/report/?${ stringify( filtersState ) }` } )
			.then( response => {
				updateState( { type: 'UPDATE_ALL', payload: response } );
				setIsRefetching( false );
				setHasFetchedOnce( true );
			} )
			.catch( errorResponse => {
				setError( errorResponse );
				setIsRefetching( false );
				setHasFetchedOnce( true );
			} );
	}, [ filtersState ] );

	if ( ! hasFetchedOnce && isRefetching ) {
		return (
			<div className="pa__loading">
				<Spinner />
			</div>
		);
	}

	if ( error ) {
		return <Notice noticeText={ error.message } isError />;
	}

	const handleFilterChange = type => payload => dispatchFilter( { type, payload } );

	return (
		<div className={ classnames( 'pa__wrapper', { 'pa__wrapper--loading': isRefetching } ) }>
			<Filters
				disabled={ isRefetching }
				labelFilters={ labels }
				eventActionFilters={ actions }
				state={ filtersState }
				onChange={ handleFilterChange }
			/>
			{ report && <Chart data={ report } isLoading={ isRefetching } /> }
			{ key_metrics && (
				<Info
					keyMetrics={ key_metrics }
					filtersState={ filtersState }
					labelFilters={ labels }
					isLoading={ isRefetching }
					postEditLink={ post_edit_link }
				/>
			) }
		</div>
	);
};

export default withWizardScreen( PopupAnalytics );
