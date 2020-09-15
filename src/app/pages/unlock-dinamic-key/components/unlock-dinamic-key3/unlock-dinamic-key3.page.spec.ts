import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UnlockDinamicKey3Page } from './unlock-dinamic-key3.page';

describe('UnlockDinamicKey3Page', () => {
  let component: UnlockDinamicKey3Page;
  let fixture: ComponentFixture<UnlockDinamicKey3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlockDinamicKey3Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UnlockDinamicKey3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
