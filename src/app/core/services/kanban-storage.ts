import { Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';
 
@Injectable({ providedIn: 'root'})
export class KanbanStorageService {
  private readonly USER_KEY = 'kanban_user';
  private readonly PROJECTS_KEY = 'kanban_projects';
 
  userName = signal<string | null>(this.getUserName());
  projects = signal<Project[]>(this.getProjects());
 
  getUserName(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }
 
  saveUserName(name: string): void {
    localStorage.setItem(this.USER_KEY, name);
    this.userName.set(name);
  }
 
  getProjects(): Project[] {
    const data = localStorage.getItem(this.PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  }
 
  saveProjects(projects: Project[]): void {
    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
    this.projects.set(projects);
  }
 
  createProject(name: string): Project {
    const project: Project = {
      id: crypto.randomUUID(),
      name,
      columns: [
        { id: 'todo', name: 'Todo', isDefault: true, isProtected: true },
        { id: 'working', name: 'Working', isDefault: true },
        { id: 'testing', name: 'Testing', isDefault: true },
        { id: 'review', name: 'Review', isDefault: true },
        { id: 'actual-testing', name: 'Actual Testing', isDefault: true },
        { id: 'completed', name: 'Completed', isDefault: true, isProtected: true }
      ],
      tasks: []
    };
 
    const updatedProjects = [...this.projects(), project];
    this.saveProjects(updatedProjects);
 
    return project;
  }
 
  updateProject(updatedProject: Project): void {
    const updatedProjects = this.projects().map(project =>
      project.id === updatedProject.id ? updatedProject : project
    );
 
    this.saveProjects(updatedProjects);
  }
 
  getProjectById(id: string): Project | undefined {
    return this.projects().find(project => project.id === id);
  }
}