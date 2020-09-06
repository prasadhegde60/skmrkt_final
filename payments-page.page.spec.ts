import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentsPagePage } from './payments-page.page';

describe('PaymentsPagePage', () => {
  let component: PaymentsPagePage;
  let fixture: ComponentFixture<PaymentsPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
