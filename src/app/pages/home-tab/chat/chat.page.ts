import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {ServiceProvider} from '../../entities/service-provider';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  serviceProvider: ServiceProvider;

  constructor(public navController: NavController, private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.serviceProvider = response.data;
    });
  }

}
