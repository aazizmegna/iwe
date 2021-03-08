import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {ServiceProvider} from '../../entities/service-provider';
import {AuthServerProvider} from '../../../services/auth/auth-jwt.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {Subscription} from 'rxjs';
import {stompConfig} from './stomp-config';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {

  serviceProvider: ServiceProvider;
  receivedMessages: any[];
  name: string;
  webSocketEndPoint = 'http://localhost:8080/ws';
  stompClient: any;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;
  private topicSubscription: Subscription;


  form = this.formBuilder.group({
    message: [],
  });

  constructor(public navController: NavController, private activatedRoute: ActivatedRoute, private authProvider: AuthServerProvider,
              protected formBuilder: FormBuilder, private rxStompService: RxStompService
  ) {
    this.authProvider = authProvider;
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

  }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe((response) => {
      this.serviceProvider = response.data;
    });
    this.topicSubscription = this.rxStompService.watch(this.serviceProvider.id + '/queue/messages')
      .subscribe((message: Message) => {
      this.receivedMessages.push(message.body);
      console.log('received this message: ', message.body);
    });
  }

  onSendMessage() {
    const message = {
      sender: this.authProvider.user.id,
      receiver: this.serviceProvider.id,
      content: 'test',
      timestamp: new Date(),
    };
    this.rxStompService.publish({destination: '/chat', body: 'test'});
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
  }
}
