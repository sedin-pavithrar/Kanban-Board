import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { KanbanStorageService } from '../services/kanban-storage';

export const onboardingGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storage = inject(KanbanStorageService);

  if (storage.getUserName()) {
    router.navigate(['/projects']);
    return false;
  }
  return true;
};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storage = inject(KanbanStorageService);

  if (!storage.getUserName()) {
    router.navigate(['']);
    return false;
  }
  return true;
};
