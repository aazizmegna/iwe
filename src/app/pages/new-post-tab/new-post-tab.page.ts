import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {JhiDataUtils} from 'ng-jhipster';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {NavController, Platform, ToastController} from '@ionic/angular';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {PicturePost} from './picture-post.model';
import {PicturePostService} from './picture-post.service';
import {Post} from './post.model';
import {PostService} from './post.service';
import {Service, ServiceService} from '../entities/service';
import {AuthServerProvider} from '../../services/auth/auth-jwt.service';
import {ServiceConsumer} from '../entities/service-consumer';
import {ServiceProvider} from '../entities/service-provider';

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
  isReadyToSave: boolean;

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
    private authProvider: AuthServerProvider
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
    this.postService.query({filter: 'picturepost-is-null'}).subscribe(
      (data) => {
        if (this.picturePost && !this.picturePost.post || !this.picturePost.post.id) {
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
      this.isNew = this.picturePost && this.picturePost.id === null || this.picturePost.id === undefined;
      this.updateForm(this.picturePost);
    });

    console.log(this.picturePost);
  }

  updateForm(picturePost: PicturePost) {
    this.form.patchValue({
      id: picturePost.id,
      content: picturePost.content,
      contentContentType: picturePost.contentContentType,
      post: picturePost.post,
    });
  }

  save() {
    this.isSaving = true;
    const post = this.createFromPostForm();
    this.subscribeToPostSaveResponse(this.postService.create(post));
  }

  protected subscribeToPostSaveResponse(result: Observable<HttpResponse<Post>>) {
    result.subscribe(
      (res: HttpResponse<Post>) => this.savePicturePost(res.body),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Post>>) {
    result.subscribe(
      (res: HttpResponse<Post>) => this.onSaveSuccess(res.body),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  protected savePicturePost(post: Post) {
    if (this.form.get(['price']).value) {
      const service = this.createFromServiceForm();
      this.subscribeToSaveResponse(this.serviceService.create(service));
    } else {
      const picturePost = this.createFromForm(post);
      this.subscribeToSaveResponse(this.picturePostService.create(picturePost));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({message: `PicturePost ${action} successfully.`, duration: 2000, position: 'middle'});
    toast.present();
    this.form.reset();
    this.clearInputImage('content', 'contentContentType', 'fileImage');
    this.navController.navigateBack('/tabs/home');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({message: 'Please Fill in all fields on the form', duration: 2000, position: 'middle'});
    toast.present();
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

  private createFromServiceForm(): Service {
    const serviceProvider: ServiceProvider = new ServiceProvider();
    const serviceConsumer: ServiceConsumer = new ServiceConsumer();
    serviceProvider.id = 1; // TODO: CHANGE THIS TO ACTUAL CURRENTLY LOGGEDIN PROVIDER ID
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
      serviceConsumer,
      serviceProvider,
    };
  }

  private createFromPostForm(): Post {
    // const serviceProvider: ServiceProvider = new ServiceProvider();
    // const serviceConsumer: ServiceConsumer = new ServiceConsumer();
    // serviceProvider.id = this.authProvider.user.serviceProviderId;
    // serviceProvider.user = this.authProvider.user;
    // serviceConsumer.id = this.authProvider.user.serviceConsumerId;
    return {
      ...new Post(),
      id: this.form.get(['id']).value,
      location: this.form.get(['location']).value,
      description: this.form.get(['description']).value,
      timePosted: new Date()
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
