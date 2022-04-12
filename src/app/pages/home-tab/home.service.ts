import {Injectable} from '@angular/core';
import {Booking, BookingService} from '../entities/booking';
import {PicturePost, PicturePostService, Post, PostService} from '../entities/post';
import {Service, ServiceService} from '../entities/service';
import {concat, orderBy} from 'lodash';
import {Home} from './home.model';
import {Reaction} from '../entities/reaction';
import {ServiceConsumer} from '../entities/service-consumer';
import {ServiceProvider} from '../entities/service-provider';
import {Transaction} from '../entities/transaction';
import {AuthServerProvider} from '../../services/auth/auth-jwt.service';
import {filter, map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  services: Service[];
  picturePosts: PicturePost[];


  constructor(private postService: PostService, private picturePostService: PicturePostService,
              private servicesService: ServiceService, private authProvider: AuthServerProvider) {
    this.picturePosts = [];
    this.services = [];

  }

  async loadAllFreemiumPostsWithBusinessUsersPosts(userId?: number, loading?: boolean): Promise<Home[]> {
    const [allServices, allPicturePosts] = await Promise.all([this.servicesService
      .query()
      .pipe(
        filter((res: HttpResponse<Service[]>) => res.ok),
        map((res: HttpResponse<Service[]>) => res.body)).toPromise(),
      this.picturePostService
        .query()
        .pipe(
          filter((res: HttpResponse<PicturePost[]>) => res.ok),
          map((res: HttpResponse<PicturePost[]>) => res.body)).toPromise()
    ]);
    const services: Home[] = allServices.map((service) => {
      return {
        id: service.id,
        location: service.location,
        timePosted: service.timePosted,
        name: service.name,
        picture: service.picture,
        price: service.price,
        imageUrl: service.imageUrl,
        pictureContentType: service.pictureContentType,
        serviceProvider: service.serviceProvider,
        serviceConsumer: service.serviceConsumer
        // description?: ser, //TODO: ADD DESCRIPTION ON SERVICES ON BACKEND
        // reactions: service.re, //TODO: ADD reactions ON SERVICES ON BACKEND
      };
    });
    console.log(allPicturePosts);
    const posts: Home[] = allPicturePosts.map((post) => {
      return {
        id: post.id,
        location: post.post ? post.post.location : null,
        timePosted: post.post ? post.post.timePosted : null,
        name: post.post ? post.post.description : null,
        picture: post.content,
        price: undefined,
        imageUrl: post.imageUrl,
        pictureContentType: post.contentContentType,
        serviceProvider: post.post ? post.post.serviceProvider : undefined,
        serviceConsumer: post.post ? post.post.serviceConsumer : undefined
      };
    });

    const homeFeed = concat(services, posts);
    if (!loading) {
      console.log(homeFeed);

      return homeFeed.filter((post) => {
        // TODO: CHANGE THE PROVIDER ID CHECK TO CHECK USER ID FROM COGNITO
        return post.serviceProvider ? post.serviceProvider.id === userId : null;
      });
    } else if (!loading) {
      console.log(homeFeed);
      return homeFeed.filter((post) => {
        // TODO: CHANGE THE CONSUMER ID CHECK TO CHECK USER ID FROM COGNITO
        return post.serviceConsumer ? post.serviceConsumer.id === userId : null;
      });
    }
    return Promise.resolve(orderBy(homeFeed, ['timePosted'], ['desc']));
  }
}
