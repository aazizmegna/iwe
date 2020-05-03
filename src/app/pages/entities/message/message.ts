import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Message } from './message.model';
import { MessageService } from './message.service';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  messages: Message[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private messageService: MessageService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.messages = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.messageService
      .query()
      .pipe(
        filter((res: HttpResponse<Message[]>) => res.ok),
        map((res: HttpResponse<Message[]>) => res.body)
      )
      .subscribe(
        (response: Message[]) => {
          this.messages = response;
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

  trackId(index: number, item: Message) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/message/new');
  }

  edit(item: IonItemSliding, message: Message) {
    this.navController.navigateForward('/tabs/entities/message/' + message.id + '/edit');
    item.close();
  }

  async delete(message) {
    this.messageService.delete(message.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Message deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(message: Message) {
    this.navController.navigateForward('/tabs/entities/message/' + message.id + '/view');
  }
}
