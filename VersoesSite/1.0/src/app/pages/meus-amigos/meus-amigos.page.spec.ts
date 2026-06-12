import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeusAmigosPage } from './meus-amigos.page';

describe('MeusAmigosPage', () => {
  let component: MeusAmigosPage;
  let fixture: ComponentFixture<MeusAmigosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeusAmigosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
