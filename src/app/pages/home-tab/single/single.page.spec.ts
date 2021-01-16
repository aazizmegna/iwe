import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SinglePage } from './single.page';

describe('SinglePage', () => {
  let component: SinglePage;
  let fixture: ComponentFixture<SinglePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SinglePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
