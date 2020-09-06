import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuccessPagePage } from './success-page.page';

describe('SuccessPagePage', () => {
  let component: SuccessPagePage;
  let fixture: ComponentFixture<SuccessPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
