/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EmoteComponent } from './emote.component';

describe('EmoteComponent', () => {
  let component: EmoteComponent;
  let fixture: ComponentFixture<EmoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
