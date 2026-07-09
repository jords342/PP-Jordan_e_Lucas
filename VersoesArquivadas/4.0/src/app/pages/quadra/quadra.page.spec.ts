import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuadraPage } from './quadra.page';

describe('QuadraPage', () => {
  let component: QuadraPage;
  let fixture: ComponentFixture<QuadraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuadraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
