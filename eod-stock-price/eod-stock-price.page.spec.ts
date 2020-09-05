import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EodStockPricePage } from './eod-stock-price.page';

describe('EodStockPricePage', () => {
  let component: EodStockPricePage;
  let fixture: ComponentFixture<EodStockPricePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EodStockPricePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EodStockPricePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
