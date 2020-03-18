import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SavingsPage } from './savings.page';

describe('SavingsPage', () => {
  let component: SavingsPage;
  let fixture: ComponentFixture<SavingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SavingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
