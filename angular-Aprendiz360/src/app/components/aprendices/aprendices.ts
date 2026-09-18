import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { ExternalApiService } from '../../services/external-api.service';
import { Aprendiz } from '../../models/aprendiz.model';
import { Ficha } from '../../models/ficha.model';

@Component({
  selector: 'app-aprendices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aprendices.html'
})
export class AprendicesComponent implements OnInit {
  aprendices: Aprendiz[] = [];
  fichasActivas: Ficha[] = [];
  paises: string[] = [];
  textoBusqueda: string = '';
  mensajeToast: string | null = null;
  mensajeError: string | null = null;

  nuevoAprendiz: Aprendiz = {
    nombre: '',
    numeroIdentificacion: '',
    edad: 18,
    estado: 'ACTIVO',
    paisOrigen: ''
  };
  fichaSeleccionadaId?: number;

  constructor(
    private backendService: BackendService,
    private externalApi: ExternalApiService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarAprendices();
    this.cargarFichas();
    this.cargarPaises();
  }

  cargarAprendices() {
    this.backendService.getAprendices().subscribe({
      next: data => {
        this.aprendices = data;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.mensajeError = 'No se pudieron cargar los aprendices. Verifica que el backend esté activo.';
        this.changeDetector.markForCheck();
      }
    });
  }

  cargarFichas() {
    this.backendService.getFichas().subscribe({
      next: fichas => {
        this.fichasActivas = fichas.filter(f => f.estado === 'EN_EJECUCION');
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.mensajeError = 'No se pudieron cargar las fichas disponibles.';
        this.changeDetector.markForCheck();
      }
    });
  }

  cargarPaises() {
    this.externalApi.getPaises().subscribe(data => {
      this.paises = data.map((p: any) => p.name.common).sort();
      this.changeDetector.markForCheck();
    });
  }

  get aprendicesFiltradosPorTexto(): Aprendiz[] {
    if (!this.textoBusqueda.trim()) return this.aprendices;
    return this.aprendices.filter(a =>
      a.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      a.numeroIdentificacion.includes(this.textoBusqueda)
    );
  }

  mostrarToast(mensaje: string) {
    this.mensajeToast = mensaje;
    setTimeout(() => this.mensajeToast = null, 3500);
  }

  guardarAprendiz() {
    if (this.fichaSeleccionadaId) {
      this.nuevoAprendiz.ficha = { numeroFicha: this.fichaSeleccionadaId } as unknown as Ficha;
    }

    this.backendService.createAprendiz(this.nuevoAprendiz).subscribe({
      next: () => {
        this.mostrarToast('Aprendiz inscrito con éxito');
        this.cargarAprendices();
        this.cargarFichas();
        this.nuevoAprendiz = { nombre: '', numeroIdentificacion: '', edad: 18, estado: 'ACTIVO', paisOrigen: '' };
        this.fichaSeleccionadaId = undefined;
      },
      error: err => this.mostrarToast('Error: ' + (err.error || 'no se pudo registrar el aprendiz'))
    });
  }
}