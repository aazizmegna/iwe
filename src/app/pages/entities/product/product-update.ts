import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ServiceProvider, ServiceProviderService } from '../service-provider';

@Component({
  selector: 'page-product-update',
  templateUrl: 'product-update.html',
})
export class ProductUpdatePage implements OnInit {
  product: Product;
  serviceProviders: ServiceProvider[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    name: [null, []],
    sellingPrice: [null, []],
    purchasePrice: [null, []],
    qTYOnHand: [null, []],
    pictureUrl: [null, []],
    serviceProvider: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private serviceProviderService: ServiceProviderService,
    private productService: ProductService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.serviceProviderService.query().subscribe(
      (data) => {
        this.serviceProviders = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.product = response.data;
      this.isNew = this.product.id === null || this.product.id === undefined;
      this.updateForm(this.product);
    });
  }

  updateForm(product: Product) {
    this.form.patchValue({
      id: product.id,
      name: product.name,
      sellingPrice: product.sellingPrice,
      purchasePrice: product.purchasePrice,
      qTYOnHand: product.qTYOnHand,
      pictureUrl: product.pictureUrl,
      serviceProvider: product.serviceProvider,
    });
  }

  save() {
    this.isSaving = true;
    const product = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Product>>) {
    result.subscribe(
      (res: HttpResponse<Product>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Product ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/product');
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

  private createFromForm(): Product {
    return {
      ...new Product(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      sellingPrice: this.form.get(['sellingPrice']).value,
      purchasePrice: this.form.get(['purchasePrice']).value,
      qTYOnHand: this.form.get(['qTYOnHand']).value,
      pictureUrl: this.form.get(['pictureUrl']).value,
      serviceProvider: this.form.get(['serviceProvider']).value,
    };
  }

  compareServiceProvider(first: ServiceProvider, second: ServiceProvider): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceProviderById(index: number, item: ServiceProvider) {
    return item.id;
  }
}
