import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookingOverviewPage } from './booking-overview.page';

describe('BookingOverviewPage', () => {
  let component: BookingOverviewPage;
  let fixture: ComponentFixture<BookingOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingOverviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
