import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { Ficha } from '../../models/ficha.model';
import { Aprendiz } from '../../models/aprendiz.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  fichas: Ficha[] = [];
  aprendicesFiltrados: Aprendiz[] = [];
  fichaSeleccionadaId?: number;

  totalAprendices: number = 0;
  totalFichas: number = 0;
  aprendicesActivos: number = 0;
  fichasEnEjecucion: number = 0;
  mensajeError: string | null = null;

  constructor(
    private backendService: BackendService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen() {
    this.mensajeError = null;

    this.backendService.getFichas().subscribe(fichas => {
      this.fichas = fichas;
      this.changeDetector.markForCheck();
    }, () => {
      this.mensajeError = 'No se pudieron cargar las fichas.';
      this.changeDetector.markForCheck();
    });

    this.backendService.getStats().subscribe({
      next: stats => {
        this.totalAprendices = stats.totalAprendices;
        this.totalFichas = stats.totalFichas;
        this.aprendicesActivos = stats.aprendicesActivos;
        this.fichasEnEjecucion = stats.fichasEnEjecucion;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.mensajeError = 'No se pudieron cargar las métricas. Verifica que el backend esté activo.';
        this.changeDetector.markForCheck();
      }
    });
  }

  buscarPorFicha() {
    if (!this.fichaSeleccionadaId) {
      this.aprendicesFiltrados = [];
      return;
    }
    this.backendService.getAprendicesPorFicha(this.fichaSeleccionadaId).subscribe({
      next: data => {
        this.aprendicesFiltrados = data;
        this.changeDetector.markForCheck();
      },
      error: () => alert('Error al consultar aprendices para la ficha elegida')
    });
  }
}