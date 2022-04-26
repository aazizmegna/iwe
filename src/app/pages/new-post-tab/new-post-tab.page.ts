import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {JhiDataUtils} from 'ng-jhipster';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {LoadingController, NavController, Platform, ToastController} from '@ionic/angular';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {PicturePost} from './picture-post.model';
import {PicturePostService} from './picture-post.service';
import {Post} from './post.model';
import {PostService} from './post.service';
import {Service, ServiceService} from '../entities/service';
import {AuthServerProvider} from '../../services/auth/auth-jwt.service';
import {ServiceConsumer, ServiceConsumerService} from '../entities/service-consumer';
import {ServiceProvider, ServiceProviderService} from '../entities/service-provider';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-add-tab',
  templateUrl: './new-post-tab.page.html',
  styleUrls: ['./new-post-tab.page.scss'],
})
export class NewPostTabPage implements OnInit {
  picturePost: PicturePost;
  posts: Post[];
  @ViewChild('fileInput', {static: false}) fileInput;
  cameraOptions: CameraOptions;
  isSaving = false;
  isNew = true;
  loading;
  isReadyToSave: boolean;
  isProvider: boolean;
  errorOccurred = false;
  form = this.formBuilder.group({
    id: [],
    price: [],
    name: [],
    content: new FormControl([null, []], Validators.required),
    contentContentType: new FormControl([null, []], Validators.required),
    post: [null, []],
    location: [null, []],
    description: [null, []],
    timePosted: [null, []],
    serviceConsumer: [null, []],
    serviceProvider: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private elementRef: ElementRef,
    private camera: Camera,
    private postService: PostService,
    private picturePostService: PicturePostService,
    private serviceService: ServiceService,
    private authProvider: AuthServerProvider,
    public loadingController: LoadingController,
    private serviceProviderService: ServiceProviderService,
    private $localstorage: LocalStorageService,
    private serviceConsumerService: ServiceConsumerService
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

  async presentLoading() {
    if (this.isSaving) {
      await this.loading.present();
    }
    if (!this.isSaving) {
      await this.loading.dismiss();
    }
  }

  async isConsumer() {
    console.log('in IsConsumer');
    const provider = await this.serviceProviderService.findByUserEmail(this.$localstorage.retrieve('email')).toPromise();
    const consumer = await this.serviceConsumerService.findByUserEmail(this.$localstorage.retrieve('email')).toPromise();
    if (consumer.body && !provider.body) {
      this.isProvider = false;
    } else if (!consumer.body && provider.body) {
      this.isProvider = true;
    }
    if (!consumer.body && !provider.body) {
      this.errorOccurred = true;
    }
  }

  async ionViewWillEnter() {
    await this.isConsumer();
  }


  async ngOnInit() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    this.postService.query().subscribe(
      (data) => {
        if (this.picturePost && !this.picturePost.post) {
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
      this.picturePost = response.data;
    });

    console.log(this.picturePost);
  }

  async save() {
    this.isSaving = true;
    if (this.form.get(['price']).value) {
      const service = this.createFromServiceForm();
      await this.presentLoading();
      await this.subscribeToSaveResponse(this.serviceService.create(await service));
    } else {
      const post = this.createFromPostForm();
      this.subscribeToPostSaveResponse(this.postService.create(await post));
    }
  }

  protected subscribeToPostSaveResponse(picturePost: Observable<HttpResponse<Post>>) {
    picturePost.subscribe(
      (res: HttpResponse<Post>) => {
        const picturePostValues = this.createFromForm(res.body);
        this.subscribeToSaveResponse(this.picturePostService.create(picturePostValues));
      }
      ,
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Post>>) {
    result.subscribe(
      async (res: HttpResponse<Post>) => {
        this.isSaving = true;
        await this.onSaveSuccess(res.body);
      },
      (res: HttpErrorResponse) => this.onError(res.error));
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    await this.presentLoading();
    const toast = await this.toastCtrl.create({message: `PicturePost ${action} successfully.`, duration: 2000, position: 'middle'});
    await toast.present();
    this.form.reset();
    this.clearInputImage('content', 'contentContentType', 'fileImage');
    await this.navController.navigateBack('/tabs/home');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    if (this.errorOccurred) {
      this.isSaving = false;
      console.error(error);
      const toast = await this.toastCtrl.create({message: 'Please Fill in all fields on the form', duration: 2000, position: 'middle'});
      toast.present();
      await this.presentLoading();
    }
  }

  private createFromForm(post: Post): PicturePost {
    return {
      ...new PicturePost(),
      id: this.form.get(['id']).value,
      content: this.form.get(['content']).value,
      contentContentType: this.form.get(['contentContentType']).value,
      post,
    };
  }

  private async createFromServiceForm(): Promise<Service> {
    const serviceProvider: ServiceProvider = new ServiceProvider();
    const provider = await this.serviceProviderService.findByUserEmail(this.$localstorage.retrieve('email')).toPromise();
    serviceProvider.id = provider.body.id; // TODO: CHANGE THIS TO ACTUAL CURRENTLY LOGGEDIN PROVIDER ID
    serviceProvider.user = this.authProvider.user;
    return {
      ...new Service(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      picture: this.form.get(['content']).value,
      pictureContentType: this.form.get(['contentContentType']).value,
      location: this.form.get(['location']).value,
      price: this.form.get(['price']).value,
      timePosted: new Date(),
      serviceProvider,
    };
  }

  private async createFromPostForm(): Promise<Post> {
    const consumer = await this.serviceConsumerService.findByUserEmail(this.$localstorage.retrieve('email')).toPromise();
    const serviceConsumer: ServiceConsumer = new ServiceConsumer();
    serviceConsumer.id = consumer.body.id;
    return {
      ...new Post(),
      location: this.form.get(['location']).value,
      description: this.form.get(['description']).value,
      timePosted: new Date(),
      serviceConsumer
    };
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
    this.fileInput.nativeElement.click();
    // if (Camera.installed()) {
    //   this.camera.getPicture(this.cameraOptions).then(
    //     (data) => {
    //       this.picturePost[fieldName] = data;
    //       this.picturePost[fieldName + 'ContentType'] = 'image/jpeg';
    //       this.form.patchValue({[fieldName]: data});
    //       this.form.patchValue({[fieldName + 'ContentType']: 'image/jpeg'});
    //     },
    //     (err) => {
    //       alert('Unable to take photo');
    //     }
    //   );
    // } else {
    //   this.fileInput.nativeElement.click();
    // }
  }

  processWebImage(event, fieldName) {
    const reader = new FileReader();
    this.picturePost = new PicturePost();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      const imageType = event.target.files[0].type;
      imageData = imageData.substring(imageData.indexOf(',') + 1);

      this.form.patchValue({[fieldName]: imageData});
      this.form.patchValue({[fieldName + 'ContentType']: imageType});
      this.picturePost[fieldName] = imageData;
      this.picturePost[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.picturePost, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({[field]: ''});
  }

  comparePost(first: Post, second: Post): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPostById(index: number, item: Post) {
    return item.id;
  }
}
