import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { FichasComponent } from './components/fichas/fichas';
import { AprendicesComponent } from './components/aprendices/aprendices';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'fichas', component: FichasComponent },
  { path: 'aprendices', component: AprendicesComponent }
];