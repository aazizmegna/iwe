import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Connection } from './connection.model';
import { ConnectionService } from './connection.service';
import { ServiceConsumer, ServiceConsumerService } from '../service-consumer';
import { ServiceProvider, ServiceProviderService } from '../service-provider';

@Component({
  selector: 'page-connection-update',
  templateUrl: 'connection-update.html',
})
export class ConnectionUpdatePage implements OnInit {
  connection: Connection;
  serviceConsumers: ServiceConsumer[];
  serviceProviders: ServiceProvider[];
  startedAt: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    startedAt: [null, []],
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
    private connectionService: ConnectionService
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
      this.connection = response.data;
      this.isNew = this.connection.id === null || this.connection.id === undefined;
      this.updateForm(this.connection);
    });
  }

  updateForm(connection: Connection) {
    this.form.patchValue({
      id: connection.id,
      startedAt: this.isNew ? new Date().toISOString() : connection.startedAt,
      serviceConsumer: connection.serviceConsumer,
      serviceProvider: connection.serviceProvider,
    });
  }

  save() {
    this.isSaving = true;
    const connection = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.connectionService.update(connection));
    } else {
      this.subscribeToSaveResponse(this.connectionService.create(connection));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Connection>>) {
    result.subscribe(
      (res: HttpResponse<Connection>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Connection ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/connection');
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

  private createFromForm(): Connection {
    return {
      ...new Connection(),
      id: this.form.get(['id']).value,
      startedAt: new Date(this.form.get(['startedAt']).value),
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
