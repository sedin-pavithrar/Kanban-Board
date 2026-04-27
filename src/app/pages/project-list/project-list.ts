import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { KanbanStorageService } from '../../core/services/kanban-storage';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent {
  storage = inject(KanbanStorageService);
  private router = inject(Router);

  projectName = signal('');

  createProject(): void {
    const name = this.projectName().trim();

    if (!name) return;

    const project = this.storage.createProject(name);
    this.router.navigate(['/projects', project.id]);
  }

  openProject(id: string): void {
    this.router.navigate(['/projects', id]);
  }
}