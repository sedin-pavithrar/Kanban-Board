import { Routes } from '@angular/router';
import { OnboardingComponent } from './pages/onboarding/onboarding';
import { ProjectListComponent } from './pages/project-list/project-list';
import { KanbanBoardComponent } from './pages/kanban-board/kanban-board';
import { onboardingGuard, authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: OnboardingComponent, canActivate: [onboardingGuard] },
  { path: 'projects', component: ProjectListComponent, canActivate: [authGuard] },
  { path: 'projects/:id', component: KanbanBoardComponent, canActivate: [authGuard] }
];