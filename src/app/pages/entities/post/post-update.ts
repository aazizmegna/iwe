import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from './post.model';
import { PostService } from './post.service';
import { ServiceConsumer, ServiceConsumerService } from '../service-consumer';
import { ServiceProvider, ServiceProviderService } from '../service-provider';
import { Feed, FeedService } from '../feed';
import {PicturePost} from './picture-post.model';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {JhiDataUtils} from 'ng-jhipster';
import {PicturePostService} from './picture-post.service';

@Component({
  selector: 'page-post-update',
  templateUrl: 'post-update.html',
})
export class PostUpdatePage implements OnInit {
  post: Post;
  serviceConsumers: ServiceConsumer[];
  serviceProviders: ServiceProvider[];
  picturePost: PicturePost;
  posts: Post[];
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  feeds: Feed[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    location: [null, []],
    description: [null, []],
    serviceConsumer: [null, []],
    serviceProvider: [null, []],
    content: [null, []],
    contentContentType: [null, []],
    post: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private serviceConsumerService: ServiceConsumerService,
    private serviceProviderService: ServiceProviderService,
    private feedService: FeedService,
    private postService: PostService,
    private dataUtils: JhiDataUtils,
    private elementRef: ElementRef,
    private camera: Camera,
    private picturePostService: PicturePostService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    // Set the Camera options
    this.cameraOptions = {
      quality: 100,
      targetWidth: 900,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: true,
      sourceType: 1,
    };
  }

  ngOnInit() {
    this.serviceConsumerService.query().subscribe(
      (data) => {
        this.serviceConsumers = data.body;
      },
      (error) => this.onError(error)
    );
    this.serviceProviderService.query().subscribe(
      (data) => {
        this.serviceProviders = data.body;
      },
      (error) => this.onError(error)
    );
    this.feedService.query().subscribe(
      (data) => {
        this.feeds = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.post = response.data;
      this.isNew = this.post.id === null || this.post.id === undefined;
      this.picturePost = response.data;
      this.isNew = this.picturePost.id === null || this.picturePost.id === undefined;
      this.updateForm(this.post, this.picturePost);
    });
    this.postService.query({ filter: 'picturepost-is-null' }).subscribe(
      (data) => {
        if (!this.picturePost.post || !this.picturePost.post.id) {
          this.posts = data.body;
        } else {
          this.postService.find(this.picturePost.post.id).subscribe(
            (subData: HttpResponse<Post>) => {
              this.posts = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {

    });
  }

  updateForm(post: Post, picturePost: PicturePost) {
    this.form.patchValue({
      id: post.id,
      location: post.location,
      description: post.description,
      serviceConsumer: post.serviceConsumer,
      serviceProvider: post.serviceProvider,
      content: picturePost.content,
      contentContentType: picturePost.contentContentType,
      post: picturePost.post,
    });
  }

  save() {
    this.isSaving = true;
    const post = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.postService.update(post));
      this.subscribeToSaveResponse(this.picturePostService.update(post));
    } else {
      this.subscribeToSaveResponse(this.postService.create(post));
      this.subscribeToSaveResponse(this.picturePostService.create(post));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Post>>) {
    result.subscribe(
      (res: HttpResponse<Post>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Post ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/post');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    toast.present();
  }

  private createFromForm(): Post | PicturePost {
    return {
      ...new Post(),
      id: this.form.get(['id']).value,
      location: this.form.get(['location']).value,
      description: this.form.get(['description']).value,
      serviceConsumer: this.form.get(['serviceConsumer']).value,
      serviceProvider: this.form.get(['serviceProvider']).value,
      ...new PicturePost(),
      content: this.form.get(['content']).value,
      contentContentType: this.form.get(['contentContentType']).value,
    };
  }

  compareServiceConsumer(first: ServiceConsumer, second: ServiceConsumer): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceConsumerById(index: number, item: ServiceConsumer) {
    return item.id;
  }
  compareServiceProvider(first: ServiceProvider, second: ServiceProvider): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceProviderById(index: number, item: ServiceProvider) {
    return item.id;
  }
  compareFeed(first: Feed, second: Feed): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFeedById(index: number, item: Feed) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field, isImage) {
    this.dataUtils.loadFileToForm(event, this.form, field, isImage).subscribe();
    this.processWebImage(event, field);
  }

  getPicture(fieldName) {
    if (Camera.installed()) {
      this.camera.getPicture(this.cameraOptions).then(
        (data) => {
          this.picturePost[fieldName] = data;
          this.picturePost[fieldName + 'ContentType'] = 'image/jpeg';
          this.form.patchValue({ [fieldName]: data });
          this.form.patchValue({ [fieldName + 'ContentType']: 'image/jpeg' });
        },
        (err) => {
          alert('Unable to take photo');
        }
      );
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event, fieldName) {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      const imageType = event.target.files[0].type;
      imageData = imageData.substring(imageData.indexOf(',') + 1);

      this.form.patchValue({ [fieldName]: imageData });
      this.form.patchValue({ [fieldName + 'ContentType']: imageType });
      this.picturePost[fieldName] = imageData;
      this.picturePost[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.picturePost, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
  comparePost(first: Post, second: Post): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }
}
