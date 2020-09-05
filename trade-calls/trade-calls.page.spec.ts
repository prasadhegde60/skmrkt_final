import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TradeCallsPage } from './trade-calls.page';

describe('TradeCallsPage', () => {
  let component: TradeCallsPage;
  let fixture: ComponentFixture<TradeCallsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeCallsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TradeCallsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
