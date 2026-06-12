import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinhasQuadrasPage } from './minhas-quadras.page';

describe('MinhasQuadrasPage', () => {
  let component: MinhasQuadrasPage;
  let fixture: ComponentFixture<MinhasQuadrasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinhasQuadrasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
