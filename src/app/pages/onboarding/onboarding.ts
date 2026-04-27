import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KanbanStorageService } from '../../core/services/kanban-storage';
import { Router } from '@angular/router';


// Ask user name
// Save username
// Redirect to project dashboard
// Prevent already logged-in users from seeing onboarding again

@Component({
  selector: 'app-onboarding',
  standalone:true,
  imports: [FormsModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class OnboardingComponent {
  private storage = inject(KanbanStorageService);
  private router = inject(Router);

  name = signal('');

  constructor(){
    if(this.storage.getUserName()){
      this.router.navigate(['/projects']);
    }
  }

  continue():void{
    const userName = this.name().trim();
    if(!userName) return;
    this.storage.saveUserName(userName);
    this.router.navigate(['/projects']);
    
  }

}
