import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Transaction } from './transaction.model';
import { TransactionService } from './transaction.service';
import { LocationServiceProvider, LocationServiceProviderService } from '../location-service-provider';
import { Service, ServiceService } from '../service';

@Component({
  selector: 'page-transaction-update',
  templateUrl: 'transaction-update.html',
})
export class TransactionUpdatePage implements OnInit {
  transaction: Transaction;
  locationServiceProviders: LocationServiceProvider[];
  services: Service[];
  timestamp: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    paymentType: [null, []],
    timestamp: [null, []],
    locationServiceProvider: [null, []],
    service: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private locationServiceProviderService: LocationServiceProviderService,
    private serviceService: ServiceService,
    private transactionService: TransactionService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.locationServiceProviderService.query().subscribe(
      (data) => {
        this.locationServiceProviders = data.body;
      },
      (error) => this.onError(error)
    );
    this.serviceService.query().subscribe(
      (data) => {
        this.services = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.transaction = response.data;
      this.isNew = this.transaction.id === null || this.transaction.id === undefined;
      this.updateForm(this.transaction);
    });
  }

  updateForm(transaction: Transaction) {
    this.form.patchValue({
      id: transaction.id,
      paymentType: transaction.paymentType,
      timestamp: this.isNew ? new Date().toISOString() : transaction.timestamp,
      locationServiceProvider: transaction.locationServiceProvider,
      service: transaction.service,
    });
  }

  save() {
    this.isSaving = true;
    const transaction = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.transactionService.update(transaction));
    } else {
      this.subscribeToSaveResponse(this.transactionService.create(transaction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Transaction>>) {
    result.subscribe(
      (res: HttpResponse<Transaction>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Transaction ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/transaction');
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

  private createFromForm(): Transaction {
    return {
      ...new Transaction(),
      id: this.form.get(['id']).value,
      paymentType: this.form.get(['paymentType']).value,
      timestamp: new Date(this.form.get(['timestamp']).value),
      locationServiceProvider: this.form.get(['locationServiceProvider']).value,
      service: this.form.get(['service']).value,
    };
  }

  compareLocationServiceProvider(first: LocationServiceProvider, second: LocationServiceProvider): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackLocationServiceProviderById(index: number, item: LocationServiceProvider) {
    return item.id;
  }
  compareService(first: Service, second: Service): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceById(index: number, item: Service) {
    return item.id;
  }
}
