import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MessageDetailPage } from './message-detail';

describe('MessageDetailPage', () => {
  let component: MessageDetailPage;
  let fixture: ComponentFixture<MessageDetailPage>;
  const entityMock = {
    id: 0,
    user: {},
  };

  const activatedRouteMock = ({ data: of({ data: entityMock }) } as any) as ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MessageDetailPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot(), NgxWebstorageModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('OnInit', () => {
    expect(component.message).toEqual(entityMock);
  });
});
