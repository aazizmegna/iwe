import { Component, OnInit } from '@angular/core';
import { Transaction } from './transaction.model';
import { TransactionService } from './transaction.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-transaction-detail',
  templateUrl: 'transaction-detail.html',
})
export class TransactionDetailPage implements OnInit {
  transaction: Transaction = {};

  constructor(
    private navController: NavController,
    private transactionService: TransactionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.transaction = response.data;
    });
  }

  open(item: Transaction) {
    this.navController.navigateForward('/tabs/entities/transaction/' + item.id + '/edit');
  }

  async deleteModal(item: Transaction) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.transactionService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/transaction');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
