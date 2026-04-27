import { Routes } from '@angular/router';
import { OnboardingComponent } from './pages/onboarding/onboarding';
import { ProjectListComponent } from './pages/project-list/project-list';
import { KanbanBoardComponent } from './pages/kanban-board/kanban-board';

export const routes: Routes = [
  { path: '', component: OnboardingComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/:id', component: KanbanBoardComponent }
];