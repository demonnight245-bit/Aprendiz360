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
  editingAprendizId?: number;

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
    this.externalApi.getPaises().subscribe({
      next: data => {
        this.paises = data.map((p: any) => p.name.common).sort();
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.paises = ['Colombia', 'Ecuador', 'Perú', 'Venezuela', 'México', 'Argentina', 'Chile', 'España'];
        this.mensajeError = 'La lista internacional no respondió. Se cargó una lista básica de países.';
        this.changeDetector.markForCheck();
      }
    });
  }

  editarAprendiz(aprendiz: Aprendiz) {
    this.editingAprendizId = aprendiz.id;
    this.nuevoAprendiz = { ...aprendiz, ficha: aprendiz.ficha ? { ...aprendiz.ficha } : undefined };
    this.fichaSeleccionadaId = aprendiz.ficha?.numeroFicha === undefined
      ? undefined
      : Number(aprendiz.ficha.numeroFicha);
  }

  cancelarEdicion() {
    this.editingAprendizId = undefined;
    this.fichaSeleccionadaId = undefined;
    this.nuevoAprendiz = { nombre: '', numeroIdentificacion: '', edad: 18, estado: 'ACTIVO', paisOrigen: '' };
  }

  eliminarAprendiz(aprendiz: Aprendiz) {
    if (!aprendiz.id || !confirm('¿Eliminar este aprendiz?')) return;
    this.backendService.deleteAprendiz(aprendiz.id).subscribe({
      next: () => {
        this.mostrarToast('Aprendiz eliminado correctamente');
        this.cargarAprendices();
        this.cargarFichas();
      },
      error: err => this.mostrarToast('Error al eliminar: ' + (err.error || 'no se pudo eliminar el aprendiz'))
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
    if (!this.editingAprendizId && this.fichaSeleccionadaId) {
      this.nuevoAprendiz.ficha = { numeroFicha: this.fichaSeleccionadaId } as unknown as Ficha;
    }

    const request = this.editingAprendizId
      ? this.backendService.updateAprendiz(this.editingAprendizId, this.nuevoAprendiz)
      : this.backendService.createAprendiz(this.nuevoAprendiz);

    request.subscribe({
      next: () => {
        this.mostrarToast(this.editingAprendizId ? 'Aprendiz actualizado con éxito' : 'Aprendiz inscrito con éxito');
        this.cargarAprendices();
        this.cargarFichas();
        this.cancelarEdicion();
      },
      error: err => this.mostrarToast('Error: ' + (err.error || 'no se pudo registrar el aprendiz'))
    });
  }
}