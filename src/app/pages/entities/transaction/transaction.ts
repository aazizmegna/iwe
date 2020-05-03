import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Transaction } from './transaction.model';
import { TransactionService } from './transaction.service';

@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html',
})
export class TransactionPage {
  transactions: Transaction[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private transactionService: TransactionService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.transactions = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.transactionService
      .query()
      .pipe(
        filter((res: HttpResponse<Transaction[]>) => res.ok),
        map((res: HttpResponse<Transaction[]>) => res.body)
      )
      .subscribe(
        (response: Transaction[]) => {
          this.transactions = response;
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

  trackId(index: number, item: Transaction) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/transaction/new');
  }

  edit(item: IonItemSliding, transaction: Transaction) {
    this.navController.navigateForward('/tabs/entities/transaction/' + transaction.id + '/edit');
    item.close();
  }

  async delete(transaction) {
    this.transactionService.delete(transaction.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Transaction deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(transaction: Transaction) {
    this.navController.navigateForward('/tabs/entities/transaction/' + transaction.id + '/view');
  }
}
