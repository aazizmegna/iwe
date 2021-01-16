import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CuePage } from './cue.page';

describe('CuePage', () => {
  let component: CuePage;
  let fixture: ComponentFixture<CuePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
