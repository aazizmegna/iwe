import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Rating } from './rating.model';
import { RatingService } from './rating.service';

@Component({
  selector: 'page-rating-update',
  templateUrl: 'rating-update.html',
})
export class RatingUpdatePage implements OnInit {
  rating: Rating;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    rating: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private ratingService: RatingService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.rating = response.data;
      this.isNew = this.rating.id === null || this.rating.id === undefined;
      this.updateForm(this.rating);
    });
  }

  updateForm(rating: Rating) {
    this.form.patchValue({
      id: rating.id,
      rating: rating.rating,
    });
  }

  save() {
    this.isSaving = true;
    const rating = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.ratingService.update(rating));
    } else {
      this.subscribeToSaveResponse(this.ratingService.create(rating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Rating>>) {
    result.subscribe(
      (res: HttpResponse<Rating>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Rating ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/rating');
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

  private createFromForm(): Rating {
    return {
      ...new Rating(),
      id: this.form.get(['id']).value,
      rating: this.form.get(['rating']).value,
    };
  }
}
