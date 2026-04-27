import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // form handle for ngmodel
import { KanbanStorageService } from '../../core/services/kanban-storage';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectListComponent {
  storage = inject(KanbanStorageService);
  private router = inject(Router); 

  projectName = signal(''); // stores  current value of the project name input field. and it also updates UI 

  createProject(): void {
    const name = this.projectName().trim(); // get input value

    if (!name) return; //guard clause

    const project = this.storage.createProject(name); // { id: '', name: 'project name' }
    this.router.navigate(['/projects', project.id]); // pge navi
  }

  openProject(id: string): void {
    this.router.navigate(['/projects', id]);
  } //existing proj open
}