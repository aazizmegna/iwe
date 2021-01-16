import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CuRideConfirmPage } from './cu-ride-confirm.page';

describe('CuRideConfirmPage', () => {
  let component: CuRideConfirmPage;
  let fixture: ComponentFixture<CuRideConfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuRideConfirmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CuRideConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
