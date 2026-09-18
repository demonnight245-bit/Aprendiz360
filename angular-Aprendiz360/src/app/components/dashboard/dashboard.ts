import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { Ficha } from '../../models/ficha.model';
import { Aprendiz } from '../../models/aprendiz.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  fichas: Ficha[] = [];
  aprendicesFiltrados: Aprendiz[] = [];
  fichaSeleccionadaId?: number;

  totalAprendices: number = 0;
  totalFichas: number = 0;

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen() {
    this.backendService.getFichas().subscribe(fichas => {
      this.fichas = fichas;
      this.totalFichas = fichas.length;
    });

    this.backendService.getAprendices().subscribe(aprendices => {
      this.totalAprendices = aprendices.length;
    });
  }

  buscarPorFicha() {
    if (!this.fichaSeleccionadaId) {
      this.aprendicesFiltrados = [];
      return;
    }
    this.backendService.getAprendicesPorFicha(this.fichaSeleccionadaId).subscribe({
      next: data => this.aprendicesFiltrados = data,
      error: () => alert('Error al consultar aprendices para la ficha elegida')
    });
  }
}