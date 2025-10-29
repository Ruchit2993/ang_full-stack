import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddEdit } from './user-add-edit';

describe('UserAddEdit', () => {
  let component: UserAddEdit;
  let fixture: ComponentFixture<UserAddEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAddEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
