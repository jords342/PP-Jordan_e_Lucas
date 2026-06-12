import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriarQuadraPage } from './criar-quadra.page';

describe('CriarQuadraPage', () => {
  let component: CriarQuadraPage;
  let fixture: ComponentFixture<CriarQuadraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarQuadraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
