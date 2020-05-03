import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Message } from './message.model';
import { MessageService } from './message.service';
import { ServiceConsumer, ServiceConsumerService } from '../service-consumer';
import { ServiceProvider, ServiceProviderService } from '../service-provider';

@Component({
  selector: 'page-message-update',
  templateUrl: 'message-update.html',
})
export class MessageUpdatePage implements OnInit {
  message: Message;
  serviceConsumers: ServiceConsumer[];
  serviceProviders: ServiceProvider[];
  timestamp: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    content: [null, []],
    sender: [null, []],
    receiver: [null, []],
    timestamp: [null, []],
    serviceConsumer: [null, []],
    serviceProvider: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private serviceConsumerService: ServiceConsumerService,
    private serviceProviderService: ServiceProviderService,
    private messageService: MessageService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
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
    this.activatedRoute.data.subscribe((response) => {
      this.message = response.data;
      this.isNew = this.message.id === null || this.message.id === undefined;
      this.updateForm(this.message);
    });
  }

  updateForm(message: Message) {
    this.form.patchValue({
      id: message.id,
      content: message.content,
      sender: message.sender,
      receiver: message.receiver,
      timestamp: this.isNew ? new Date().toISOString() : message.timestamp,
      serviceConsumer: message.serviceConsumer,
      serviceProvider: message.serviceProvider,
    });
  }

  save() {
    this.isSaving = true;
    const message = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.messageService.update(message));
    } else {
      this.subscribeToSaveResponse(this.messageService.create(message));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Message>>) {
    result.subscribe(
      (res: HttpResponse<Message>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Message ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/message');
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

  private createFromForm(): Message {
    return {
      ...new Message(),
      id: this.form.get(['id']).value,
      content: this.form.get(['content']).value,
      sender: this.form.get(['sender']).value,
      receiver: this.form.get(['receiver']).value,
      timestamp: new Date(this.form.get(['timestamp']).value),
      serviceConsumer: this.form.get(['serviceConsumer']).value,
      serviceProvider: this.form.get(['serviceProvider']).value,
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
}
