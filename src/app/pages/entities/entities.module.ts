import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserRouteAccessService } from 'src/app/services/auth/user-route-access.service';
import { EntitiesPage } from './entities.page';

const routes: Routes = [
  {
    path: '',
    component: EntitiesPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'location-service-provider',
    loadChildren: './location-service-provider/location-service-provider.module#LocationServiceProviderPageModule',
  },
  {
    path: 'transaction',
    loadChildren: './transaction/transaction.module#TransactionPageModule',
  },
  {
    path: 'service',
    loadChildren: './service/service.module#ServicePageModule',
  },
  {
    path: 'ride',
    loadChildren: './ride/ride.module#RidePageModule',
  },
  {
    path: 'iwe-subscription',
    loadChildren: './iwe-subscription/iwe-subscription.module#IWESubscriptionPageModule',
  },
  {
    path: 'subscription-specification',
    loadChildren: './subscription-specification/subscription-specification.module#SubscriptionSpecificationPageModule',
  },
  {
    path: 'service-provider',
    loadChildren: './service-provider/service-provider.module#ServiceProviderPageModule',
  },
  {
    path: 'product',
    loadChildren: './product/product.module#ProductPageModule',
  },
  {
    path: 'rating',
    loadChildren: './rating/rating.module#RatingPageModule',
  },
  {
    path: 'message',
    loadChildren: './message/message.module#MessagePageModule',
  },
  {
    path: 'connection',
    loadChildren: './connection/connection.module#ConnectionPageModule',
  },
  {
    path: 'service-consumer',
    loadChildren: './service-consumer/service-consumer.module#ServiceConsumerPageModule',
  },
  {
    path: 'invitation',
    loadChildren: './invitation/invitation.module#InvitationPageModule',
  },
  {
    path: 'feed',
    loadChildren: './feed/feed.module#FeedPageModule',
  },
  {
    path: 'post',
    loadChildren: './post/post.module#PostPageModule',
  },
  {
    path: 'video-post',
    loadChildren: './video-post/video-post.module#VideoPostPageModule',
  },
  {
    path: 'snapshot-post',
    loadChildren: './snapshot-post/snapshot-post.module#SnapshotPostPageModule',
  },
  {
    path: 'picture-post',
    loadChildren: './picture-post/picture-post.module#PicturePostPageModule',
  },
  {
    path: 'text-post',
    loadChildren: './text-post/text-post.module#TextPostPageModule',
  },
  {
    path: 'reaction',
    loadChildren: './reaction/reaction.module#ReactionPageModule',
  },
  {
    path: 'like',
    loadChildren: './like/like.module#LikePageModule',
  },
  {
    path: 'coment',
    loadChildren: './coment/coment.module#ComentPageModule',
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes), TranslateModule],
  declarations: [EntitiesPage],
})
export class EntitiesPageModule {}
