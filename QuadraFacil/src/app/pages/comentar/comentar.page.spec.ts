import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComentarPage } from './comentar.page';

describe('ComentarPage', () => {
  let component: ComentarPage;
  let fixture: ComponentFixture<ComentarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComentarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
