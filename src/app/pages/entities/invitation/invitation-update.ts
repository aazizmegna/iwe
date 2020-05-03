import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Invitation } from './invitation.model';
import { InvitationService } from './invitation.service';
import { ServiceConsumer, ServiceConsumerService } from '../service-consumer';

@Component({
  selector: 'page-invitation-update',
  templateUrl: 'invitation-update.html',
})
export class InvitationUpdatePage implements OnInit {
  invitation: Invitation;
  serviceConsumers: ServiceConsumer[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    sentTo: [null, []],
    content: [null, []],
    serviceConsumer: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private serviceConsumerService: ServiceConsumerService,
    private invitationService: InvitationService
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
    this.activatedRoute.data.subscribe((response) => {
      this.invitation = response.data;
      this.isNew = this.invitation.id === null || this.invitation.id === undefined;
      this.updateForm(this.invitation);
    });
  }

  updateForm(invitation: Invitation) {
    this.form.patchValue({
      id: invitation.id,
      sentTo: invitation.sentTo,
      content: invitation.content,
      serviceConsumer: invitation.serviceConsumer,
    });
  }

  save() {
    this.isSaving = true;
    const invitation = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.invitationService.update(invitation));
    } else {
      this.subscribeToSaveResponse(this.invitationService.create(invitation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Invitation>>) {
    result.subscribe(
      (res: HttpResponse<Invitation>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Invitation ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/invitation');
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

  private createFromForm(): Invitation {
    return {
      ...new Invitation(),
      id: this.form.get(['id']).value,
      sentTo: this.form.get(['sentTo']).value,
      content: this.form.get(['content']).value,
      serviceConsumer: this.form.get(['serviceConsumer']).value,
    };
  }

  compareServiceConsumer(first: ServiceConsumer, second: ServiceConsumer): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceConsumerById(index: number, item: ServiceConsumer) {
    return item.id;
  }
}
