import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EsqueceuSenhaPage } from './esqueceu-senha.page';

describe('EsqueceuSenhaPage', () => {
  let component: EsqueceuSenhaPage;
  let fixture: ComponentFixture<EsqueceuSenhaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EsqueceuSenhaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
