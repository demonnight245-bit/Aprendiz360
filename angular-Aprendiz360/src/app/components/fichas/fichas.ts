import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { Ficha } from '../../models/ficha.model';
import { Horario } from '../../models/horario.model';

@Component({
  selector: 'app-fichas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fichas.html'
})
export class FichasComponent implements OnInit {
  fichas: Ficha[] = [];
  horarios: Horario[] = [];
  readonly diasDisponibles = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  mensajeError: string | null = null;
  editingHorarioId?: number;
  editingFichaNumero?: number | string;

  // Formulario Ficha
  nuevaFicha: Ficha = {
    numeroFicha: '',
    programa: '',
    tipoFormacion: 'TECNICO',
    cuposDisponibles: 30,
    numeroAprendicesInscritos: 0,
    estado: 'EN_EJECUCION'
  };
  horarioSeleccionadoId?: number;

  // Formulario Horario
  nuevoHorario: Horario = {
    dias: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'],
    horaEntrada: '07:00',
    horaSalida: '13:00'
  };

  constructor(
    private backendService: BackendService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarFichas();
    this.cargarHorarios();
  }

  cargarFichas() {
    this.backendService.getFichas().subscribe({
      next: data => {
        this.fichas = data;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.mensajeError = 'No se pudieron cargar las fichas. Verifica que el backend esté activo.';
        this.changeDetector.markForCheck();
      }
    });
  }

  cargarHorarios() {
    this.backendService.getHorarios().subscribe(data => {
      this.horarios = data;
      this.changeDetector.markForCheck();
    });
  }

  editarHorario(horario: Horario) {
    this.editingHorarioId = horario.idHorario;
    this.nuevoHorario = { ...horario, dias: [...horario.dias] };
  }

  eliminarHorario(horario: Horario) {
    if (!horario.idHorario || !confirm('¿Eliminar este horario?')) return;
    this.backendService.deleteHorario(horario.idHorario).subscribe({
      next: () => {
        alert('Horario eliminado correctamente');
        this.cargarHorarios();
      },
      error: err => alert('No se pudo eliminar el horario: ' + (err.error || 'puede estar asignado a una ficha'))
    });
  }

  cancelarEdicionHorario() {
    this.editingHorarioId = undefined;
    this.nuevoHorario = { dias: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'], horaEntrada: '07:00', horaSalida: '13:00' };
  }

  guardarHorario() {
    const request = this.editingHorarioId
      ? this.backendService.updateHorario(this.editingHorarioId, this.nuevoHorario)
      : this.backendService.createHorario(this.nuevoHorario);

    request.subscribe({
      next: () => {
        alert(this.editingHorarioId ? 'Horario actualizado correctamente' : 'Horario creado correctamente');
        this.cancelarEdicionHorario();
        this.cargarHorarios();
      },
      error: err => alert('Error al crear el horario')
    });
  }

  editarFicha(ficha: Ficha) {
    this.editingFichaNumero = ficha.numeroFicha;
    this.nuevaFicha = { ...ficha, horario: ficha.horario ? { ...ficha.horario, dias: [...ficha.horario.dias] } : undefined };
    this.horarioSeleccionadoId = ficha.horario?.idHorario;
  }

  eliminarFicha(ficha: Ficha) {
    if (!confirm('¿Eliminar esta ficha y sus datos asociados?')) return;
    this.backendService.deleteFicha(ficha.numeroFicha).subscribe({
      next: () => {
        alert('Ficha eliminada correctamente');
        this.cargarFichas();
        this.cargarHorarios();
      },
      error: err => alert('No se pudo eliminar la ficha: ' + (err.error || 'verifica si tiene aprendices asociados'))
    });
  }

  cancelarEdicionFicha() {
    this.editingFichaNumero = undefined;
    this.horarioSeleccionadoId = undefined;
    this.nuevaFicha = { numeroFicha: '', programa: '', tipoFormacion: 'TECNICO', cuposDisponibles: 30, numeroAprendicesInscritos: 0, estado: 'EN_EJECUCION' };
  }

  guardarFicha() {
    if (this.horarioSeleccionadoId) {
      this.nuevaFicha.horario = { idHorario: this.horarioSeleccionadoId } as Horario;
    }
    const request = this.editingFichaNumero
      ? this.backendService.updateFicha(this.editingFichaNumero, this.nuevaFicha)
      : this.backendService.createFicha(this.nuevaFicha);

    request.subscribe({
      next: () => {
        alert(this.editingFichaNumero ? 'Ficha actualizada con éxito' : 'Ficha registrada con éxito');
        this.cancelarEdicionFicha();
        this.cargarFichas();
      },
      error: err => alert('Error al registrar la ficha: ' + (err.error || 'verifica los datos y el horario'))
    });
  }
}