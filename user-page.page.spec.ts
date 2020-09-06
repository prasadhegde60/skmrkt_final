import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserPagePage } from './user-page.page';

describe('UserPagePage', () => {
  let component: UserPagePage;
  let fixture: ComponentFixture<UserPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
