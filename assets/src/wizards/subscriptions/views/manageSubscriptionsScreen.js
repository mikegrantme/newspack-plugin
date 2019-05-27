/**
 * Subscription Management Screens.
 */

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Card, FormattedHeader, Button, CheckboxControl } from '../../../components';

/**
 * Subscriptions management screen.
 */
class ManageSubscriptionsScreen extends Component {
	/**
	 * Render.
	 */
	render() {
		const {
			subscriptions,
			choosePrice,
			onClickEditSubscription,
			onClickDeleteSubscription,
			onClickChoosePrice,
		} = this.props;

		const headerText = subscriptions.length
			? __( 'Any more subscriptions to add?' )
			: __( 'Add your first subscription' );
		const buttonText = subscriptions.length
			? __( 'Add another subscription' )
			: __( 'Add a subscription' );

		return (
			<div className="newspack-manage-subscriptions-screen">
				<FormattedHeader
					headerText={ headerText }
					subHeaderText={ __( 'Subscriptions can provide a stable, recurring source of revenue' ) }
				/>
				{ subscriptions.map( subscription => {
					const { id, image, name, display_price, url } = subscription;

					return (
						<Card className="newspack-manage-subscriptions-screen__subscription-card" key={ id }>
							<a href={ url } target="_blank">
								<img src={ image ? image.url : '' } />
							</a>
							<div className="newspack-manage-subscriptions-screen__subscription-card__product-info">
								<div className="product-name">{ name }</div>
								<div className="product-price">{ display_price }</div>
							</div>
							<div className="newspack-manage-subscriptions-screen__subscription-card__product-actions">
								<a
									className="edit-subscription"
									href="#"
									onClick={ () => onClickEditSubscription( subscription ) }
								>
									{ __( 'Edit' ) }
								</a>
								<a
									className="delete-subscription"
									href="#"
									onClick={ () => onClickDeleteSubscription( subscription ) }
								>
									{ __( 'Delete' ) }
								</a>
							</div>
						</Card>
					);
				} ) }
				{ !! subscriptions.length && (
					<CheckboxControl
						className="newspack-manage-subscriptions-screen__choose-price"
						label={ __( 'Allow members to specify donation amount' ) }
						onChange={ () => onClickChoosePrice() }
						tooltip={ __(
							'Enabling this makes the subscription price a "Recommended price" and allows subscribers to set the subscription price when purchasing.'
						) }
						help={ __( 'Mostly used for donations' ) }
						checked={ choosePrice }
					/>
				) }
				<Button
					isPrimary
					className="is-centered"
					onClick={ () =>
						onClickEditSubscription( {
							id: 0,
							name: '',
							image: null,
							price: '',
							frequency: 'month',
						} )
					}
				>
					{ buttonText }
				</Button>
			</div>
		);
	}
}

export default ManageSubscriptionsScreen;