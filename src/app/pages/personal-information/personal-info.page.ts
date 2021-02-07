import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {JhiDataUtils} from 'ng-jhipster';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {NavController, Platform, ToastController} from '@ionic/angular';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {PersonalInfoService} from './personal-info.service';
import {Service, ServiceService} from '../entities/service';
import {AuthServerProvider} from '../../services/auth/auth-jwt.service';
import {ServiceConsumer} from '../entities/service-consumer';
import {ServiceProvider} from '../entities/service-provider';
import {User} from '../../services/user/user.model';
import {PostService} from '../new-post-tab/post.service';
import {PicturePostService} from '../new-post-tab/picture-post.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
})
export class PersonalInfoPage implements OnInit {
  user: User;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  @ViewChild('fileInput', {static: false}) fileInput;
  form = this.formBuilder.group({
    id: [],
    firstName: [],
    lastName: [],
    content: new FormControl([null, []], Validators.required),
    contentContentType: new FormControl([null, []], Validators.required),
    email: [null, []],
    location: [],
    login:  [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private elementRef: ElementRef,
    private authProvider: AuthServerProvider,
    private personalInfoService: PersonalInfoService,
    private camera: Camera,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.user = response.data;
      // this.updateForm(this.user);
    });
    console.log(this.user);
  }

  updateForm(user: User) {
    this.form.patchValue({
      id: user.id,
      content: user.content,
      contentContentType: user.contentContentType,
      email: user.email,
    });
  }

  save() {
    this.isSaving = true;
    const user = this.createFromPostForm();
    this.subscribeToPostSaveResponse(this.personalInfoService.create(user));
  }

  protected subscribeToPostSaveResponse(result: Observable<HttpResponse<User>>) {
    result.subscribe(
      (res: HttpResponse<User>) => res.body,
      (res: HttpErrorResponse) => res.error
    );
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<User>>) {
    result.subscribe(
      (res: HttpResponse<User>) => this.onSaveSuccess(res.body),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({message: `PicturePost ${action} successfully.`, duration: 2000, position: 'middle'});
    toast.present();
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

  private createFromPostForm(): User {
    return {
      ...new User(),
      id: this.form.get(['id']).value,
      content: this.form.get(['content']).value,
      contentContentType: this.form.get(['contentContentType']).value,
      email: this.form.get(['email']).value,
      location: this.form.get(['location']).value,
      login: this.form.get(['login']).value,
      firstName: this.form.get(['firstName']).value,
      lastName: this.form.get(['lastName']).value,
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
  }

  processWebImage(event, fieldName) {
    const reader = new FileReader();
    this.user = new User();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      const imageType = event.target.files[0].type;
      imageData = imageData.substring(imageData.indexOf(',') + 1);

      this.form.patchValue({[fieldName]: imageData});
      this.form.patchValue({[fieldName + 'ContentType']: imageType});
      this.user[fieldName] = imageData;
      this.user[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.user, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({[field]: ''});
  }

  comparePost(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPostById(index: number, item: User) {
    return item.id;
  }
}
