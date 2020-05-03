import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Like } from './like.model';
import { LikeService } from './like.service';
import { Reaction, ReactionService } from '../reaction';

@Component({
  selector: 'page-like-update',
  templateUrl: 'like-update.html',
})
export class LikeUpdatePage implements OnInit {
  like: Like;
  reactions: Reaction[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    amount: [null, []],
    reaction: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private reactionService: ReactionService,
    private likeService: LikeService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.reactionService.query({ filter: 'like-is-null' }).subscribe(
      (data) => {
        if (!this.like.reaction || !this.like.reaction.id) {
          this.reactions = data.body;
        } else {
          this.reactionService.find(this.like.reaction.id).subscribe(
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
      this.like = response.data;
      this.isNew = this.like.id === null || this.like.id === undefined;
      this.updateForm(this.like);
    });
  }

  updateForm(like: Like) {
    this.form.patchValue({
      id: like.id,
      amount: like.amount,
      reaction: like.reaction,
    });
  }

  save() {
    this.isSaving = true;
    const like = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.likeService.update(like));
    } else {
      this.subscribeToSaveResponse(this.likeService.create(like));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Like>>) {
    result.subscribe(
      (res: HttpResponse<Like>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Like ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/like');
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

  private createFromForm(): Like {
    return {
      ...new Like(),
      id: this.form.get(['id']).value,
      amount: this.form.get(['amount']).value,
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
