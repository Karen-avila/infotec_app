import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UnlockDinamicKey2Page } from './unlock-dinamic-key2.page';

describe('UnlockDinamicKey2Page', () => {
  let component: UnlockDinamicKey2Page;
  let fixture: ComponentFixture<UnlockDinamicKey2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlockDinamicKey2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UnlockDinamicKey2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
