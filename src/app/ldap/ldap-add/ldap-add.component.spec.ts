import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapAddComponent } from './ldap-add.component';

describe('LdapAddComponent', () => {
  let component: LdapAddComponent;
  let fixture: ComponentFixture<LdapAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdapAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdapAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
