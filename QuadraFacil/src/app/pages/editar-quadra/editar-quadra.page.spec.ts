import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarQuadraPage } from './editar-quadra.page';

describe('EditarQuadraPage', () => {
  let component: EditarQuadraPage;
  let fixture: ComponentFixture<EditarQuadraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarQuadraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
