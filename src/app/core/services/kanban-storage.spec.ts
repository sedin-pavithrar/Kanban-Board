import { TestBed } from '@angular/core/testing';

import { KanbanStorage } from './kanban-storage';

describe('KanbanStorage', () => {
  let service: KanbanStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbanStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
