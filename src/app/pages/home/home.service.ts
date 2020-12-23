import { Injectable } from '@angular/core';
import {Booking, BookingService} from '../entities/booking';
import {PicturePost, PicturePostService, Post, PostService} from '../entities/post';
import {Service, ServiceService} from '../entities/service';
import {concat, orderBy} from 'lodash';
import {Home} from './home.model';
import {Reaction} from '../entities/reaction';
import {ServiceConsumer} from '../entities/service-consumer';
import {ServiceProvider} from '../entities/service-provider';
import {Transaction} from '../entities/transaction';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private postService: PostService, private picturePostService: PicturePostService,
              private servicesService: ServiceService) {
  }

  async loadAllFreemiumPostsWithBusinessUsersPosts(): Promise<Home[]> {
    const [allServices, allPicturePosts, allPosts] = await Promise.all([
      this.servicesService.query().toPromise(),
      this.picturePostService.query().toPromise(),
      this.postService.query().toPromise()
    ]);

    const services: Home[]  = allServices.body.map((service) => {
      return  {
         id: service.id,
         location: service.location,
         timePosted: service.timePosted,
         name: service.name,
         picture: service.picture,
         price: service.price,
         pictureContentType: service.pictureContentType
        // description?: ser, //TODO: ADD DESCRIPTION ON SERVICES ON BACKEND
        // reactions: service.re, //TODO: ADD reactions ON SERVICES ON BACKEND
      };
    });
    const pcpost = [...allPicturePosts.body]
    const ppost = [...allPosts.body]
    const mergedPosts = pcpost.map((item, i) => Object.assign({}, item, ppost[i]));
    const posts: Home[] = mergedPosts.map((post) => {
      return {
        id: post.id,
        location: post.location,
        timePosted: post.timePosted,
        name: post.description,
        picture: post.content,
        price: undefined,
        pictureContentType: post.contentContentType
      };
    });

    const homeFeed = concat(services, posts);
    return Promise.resolve(orderBy(homeFeed, ['timePosted'], ['desc']));
  }
}
