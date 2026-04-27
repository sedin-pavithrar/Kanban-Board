import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { interval } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  CdkDragDrop,
  DragDropModule,
  transferArrayItem,
  moveItemInArray
} from '@angular/cdk/drag-drop';

import { KanbanStorageService } from '../../core/services/kanban-storage';
import { Project } from '../../core/models/project.model';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [FormsModule, DragDropModule, KeyValuePipe, RouterLink],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css'
})
export class KanbanBoardComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private storage = inject(KanbanStorageService);

  project = signal<Project | null>(null);

  taskTitle = signal('');
  newColumnName = signal('');

  editingTaskId = signal<string | null>(null);
  editingTitle = signal('');

  connectedDropLists = computed(() =>
    this.project()?.columns.map((column) => column.id) ?? []
  );

  constructor() {
    const projectId = this.route.snapshot.paramMap.get('id');

    if (!projectId) {
      this.router.navigate(['/projects']);
      return;
    }

    const selectedProject = this.storage.getProjectById(projectId);

    if (!selectedProject) {
      this.router.navigate(['/projects']);
      return;
    }

    this.project.set(selectedProject);

    interval(1000).subscribe(() => {
      this.project.update(project =>
        project ? { ...project } : null
      );
    });
  }

  getTasksByColumn(columnId: string): Task[] {
    return this.project()?.tasks.filter((task: Task) => task.columnId === columnId) ?? [];
  }

  addTask(): void {
    const title = this.taskTitle().trim();
    const currentProject = this.project();

    if (!title || !currentProject) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title,
      columnId: 'todo',
      timeSpent: {},
      enteredAt: Date.now()
    };

    const updatedProject = {
      ...currentProject,
      tasks: [...currentProject.tasks, task]
    };

    this.saveProject(updatedProject);
    this.taskTitle.set('');
  }

  deleteTask(taskId: string): void {
    const currentProject = this.project();
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      tasks: currentProject.tasks.filter((task: Task) => task.id !== taskId)
    };

    this.saveProject(updatedProject);
  }

  editTask(taskId: string, newTitle: string): void {
    const currentProject = this.project();
    const title = newTitle.trim();

    if (!currentProject || !title) return;

    const updatedProject = {
      ...currentProject,
      tasks: currentProject.tasks.map(task =>
        task.id === taskId
          ? { ...task, title }
          : task
      )
    };

    this.saveProject(updatedProject);
  }

  startEdit(task: Task): void {
    this.editingTaskId.set(task.id);
    this.editingTitle.set(task.title);
  }

  saveEdit(taskId: string): void {
    this.editTask(taskId, this.editingTitle());
    this.editingTaskId.set(null);
    this.editingTitle.set('');
  }

  cancelEdit(): void {
    this.editingTaskId.set(null);
    this.editingTitle.set('');
  }

  drop(event: CdkDragDrop<Task[]>, newColumnId: string): void {
    const currentProject = this.project();
    if (!currentProject) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    const task = event.previousContainer.data[event.previousIndex];
    const now = Date.now();

    const oldColumnId = task.columnId;
    const spentTime = now - task.enteredAt;

    const updatedTask: Task = {
      ...task,
      columnId: newColumnId,
      enteredAt: now,
      timeSpent: {
        ...task.timeSpent,
        [oldColumnId]: (task.timeSpent[oldColumnId] || 0) + spentTime
      }
    };

    const updatedProject = {
      ...currentProject,
      tasks: currentProject.tasks.map((existingTask: Task) =>
        existingTask.id === updatedTask.id ? updatedTask : existingTask
      )
    };

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.saveProject(updatedProject);
  }

  addColumn(): void {
    const name = this.newColumnName().trim();
    const currentProject = this.project();

    if (!name || !currentProject) return;

    const completedIndex = currentProject.columns.findIndex(
      (column) => column.id === 'completed'
    );

    const newColumn = {
      id: crypto.randomUUID(),
      name
    };

    const updatedColumns = [...currentProject.columns];
    updatedColumns.splice(completedIndex, 0, newColumn);

    const updatedProject = {
      ...currentProject,
      columns: updatedColumns
    };

    this.saveProject(updatedProject);
    this.newColumnName.set('');
  }

  deleteColumn(columnId: string): void {
    const currentProject = this.project();
    if (!currentProject) return;

    const column = currentProject.columns.find((col) => col.id === columnId);

    if (!column || column.isProtected) return;

    const hasTasks = currentProject.tasks.some((task: Task) => task.columnId === columnId);

    if (hasTasks) {
      alert('Move or delete tasks from this column before deleting it.');
      return;
    }

    const updatedProject = {
      ...currentProject,
      columns: currentProject.columns.filter((col) => col.id !== columnId)
    };

    this.saveProject(updatedProject);
  }

  formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds}s`;
  }

  getColumnName(columnId: string): string {
    return this.project()?.columns.find((col) => col.id === columnId)?.name ?? columnId;
  }

  private saveProject(project: Project): void {
    this.project.set(project);
    this.storage.updateProject(project);
  }

  getCurrentColumnTime(task: Task): string {
    const now = Date.now();
    const currentTime = now - task.enteredAt;

    return this.formatTime(currentTime);
  }
}