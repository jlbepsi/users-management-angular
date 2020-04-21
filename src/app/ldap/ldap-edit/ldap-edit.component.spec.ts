import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapEditComponent } from './ldap-edit.component';

describe('LdapEditComponent', () => {
  let component: LdapEditComponent;
  let fixture: ComponentFixture<LdapEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdapEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdapEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
