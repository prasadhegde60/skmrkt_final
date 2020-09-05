import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistoricDataPage } from './historic-data.page';

describe('HistoricDataPage', () => {
  let component: HistoricDataPage;
  let fixture: ComponentFixture<HistoricDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
