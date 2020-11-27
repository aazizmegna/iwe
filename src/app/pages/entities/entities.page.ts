import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: Array<any> = [
    { name: 'LocationServiceProvider', component: 'LocationServiceProviderPage', route: 'location-service-provider' },
    { name: 'Transaction', component: 'TransactionPage', route: 'transaction' },
    { name: 'Service', component: 'ServicePage', route: 'service' },
    { name: 'Ride', component: 'RidePage', route: 'ride' },
    { name: 'IWESubscription', component: 'IWESubscriptionPage', route: 'iwe-subscription' },
    { name: 'SubscriptionSpecification', component: 'SubscriptionSpecificationPage', route: 'subscription-specification' },
    { name: 'ServiceProvider', component: 'ServiceProviderPage', route: 'service-provider' },
    { name: 'Product', component: 'ProductPage', route: 'product' },
    { name: 'Rating', component: 'RatingPage', route: 'rating' },
    { name: 'Message', component: 'MessagePage', route: 'message' },
    { name: 'Connection', component: 'ConnectionPage', route: 'connection' },
    { name: 'ServiceConsumer', component: 'ServiceConsumerPage', route: 'service-consumer' },
    { name: 'Invitation', component: 'InvitationPage', route: 'invitation' },
    { name: 'Feed', component: 'FeedPage', route: 'feed' },
    { name: 'Post', component: 'PostPage', route: 'post' },
    { name: 'VideoPost', component: 'VideoPostPage', route: 'video-post' },
    { name: 'SnapshotPost', component: 'SnapshotPostPage', route: 'snapshot-post' },
    { name: 'PicturePost', component: 'PicturePostPage', route: 'picture-post' },
    { name: 'TextPost', component: 'TextPostPage', route: 'text-post' },
    { name: 'Reaction', component: 'ReactionPage', route: 'reaction' },
    { name: 'Like', component: 'LikePage', route: 'like' },
    { name: 'Coment', component: 'ComentPage', route: 'coment' },
    { name: 'MarketingPost', component: 'MarketingPostPage', route: 'marketing-post' },
    { name: 'Booking', component: 'BookingPage', route: 'booking' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}
