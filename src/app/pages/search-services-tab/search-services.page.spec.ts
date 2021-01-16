import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewPostTabPage } from './search-services.page';

describe('AddTabPage', () => {
  let component: NewPostTabPage;
  let fixture: ComponentFixture<NewPostTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPostTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPostTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
