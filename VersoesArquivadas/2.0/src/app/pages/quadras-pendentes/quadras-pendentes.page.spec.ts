import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuadrasPendentesPage } from './quadras-pendentes.page';

describe('QuadrasPendentesPage', () => {
  let component: QuadrasPendentesPage;
  let fixture: ComponentFixture<QuadrasPendentesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuadrasPendentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
