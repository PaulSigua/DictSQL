import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbTabComponent } from './db-tab.component';

describe('DbTabComponent', () => {
  let component: DbTabComponent;
  let fixture: ComponentFixture<DbTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DbTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
