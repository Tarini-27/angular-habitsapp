import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Habit } from './habit';

describe('Habit', () => {
  let component: Habit;
  let fixture: ComponentFixture<Habit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Habit],
    }).compileComponents();

    fixture = TestBed.createComponent(Habit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
