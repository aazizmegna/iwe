import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Coment } from './coment.model';
import { ComentService } from './coment.service';
import { Reaction, ReactionService } from '../reaction';

@Component({
  selector: 'page-coment-update',
  templateUrl: 'coment-update.html',
})
export class ComentUpdatePage implements OnInit {
  coment: Coment;
  reactions: Reaction[];
  createdAt: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    content: [null, []],
    pictureUrl: [null, []],
    createdAt: [null, []],
    reaction: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private reactionService: ReactionService,
    private comentService: ComentService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.reactionService.query({ filter: 'coment-is-null' }).subscribe(
      (data) => {
        if (!this.coment.reaction || !this.coment.reaction.id) {
          this.reactions = data.body;
        } else {
          this.reactionService.find(this.coment.reaction.id).subscribe(
            (subData: HttpResponse<Reaction>) => {
              this.reactions = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.coment = response.data;
      this.isNew = this.coment.id === null || this.coment.id === undefined;
      this.updateForm(this.coment);
    });
  }

  updateForm(coment: Coment) {
    this.form.patchValue({
      id: coment.id,
      content: coment.content,
      pictureUrl: coment.pictureUrl,
      createdAt: this.isNew ? new Date().toISOString() : coment.createdAt,
      reaction: coment.reaction,
    });
  }

  save() {
    this.isSaving = true;
    const coment = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.comentService.update(coment));
    } else {
      this.subscribeToSaveResponse(this.comentService.create(coment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Coment>>) {
    result.subscribe(
      (res: HttpResponse<Coment>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Coment ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/coment');
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

  private createFromForm(): Coment {
    return {
      ...new Coment(),
      id: this.form.get(['id']).value,
      content: this.form.get(['content']).value,
      pictureUrl: this.form.get(['pictureUrl']).value,
      createdAt: new Date(this.form.get(['createdAt']).value),
      reaction: this.form.get(['reaction']).value,
    };
  }

  compareReaction(first: Reaction, second: Reaction): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackReactionById(index: number, item: Reaction) {
    return item.id;
  }
}
