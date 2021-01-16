import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CueRidePage } from './cue-ride.page';

describe('CueRidePage', () => {
  let component: CueRidePage;
  let fixture: ComponentFixture<CueRidePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CueRidePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CueRidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
