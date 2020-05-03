import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  products: Product[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private productService: ProductService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.products = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.productService
      .query()
      .pipe(
        filter((res: HttpResponse<Product[]>) => res.ok),
        map((res: HttpResponse<Product[]>) => res.body)
      )
      .subscribe(
        (response: Product[]) => {
          this.products = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          toast.present();
        }
      );
  }

  trackId(index: number, item: Product) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/product/new');
  }

  edit(item: IonItemSliding, product: Product) {
    this.navController.navigateForward('/tabs/entities/product/' + product.id + '/edit');
    item.close();
  }

  async delete(product) {
    this.productService.delete(product.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Product deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(product: Product) {
    this.navController.navigateForward('/tabs/entities/product/' + product.id + '/view');
  }
}
