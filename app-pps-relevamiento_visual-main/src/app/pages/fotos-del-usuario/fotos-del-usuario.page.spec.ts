import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FotosDelUsuarioPage } from './fotos-del-usuario.page';

describe('FotosDelUsuarioPage', () => {
  let component: FotosDelUsuarioPage;
  let fixture: ComponentFixture<FotosDelUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FotosDelUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
