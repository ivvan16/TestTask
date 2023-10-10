import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestGeneratorComponent } from './request-generator.component';

describe('RequestGeneratorComponent', () => {
  let component: RequestGeneratorComponent;
  let fixture: ComponentFixture<RequestGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestGeneratorComponent]
    });
    fixture = TestBed.createComponent(RequestGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
