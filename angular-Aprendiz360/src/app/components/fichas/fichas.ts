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
  mensajeError: string | null = null;

  // Formulario Ficha
  nuevaFicha: Ficha = {
    numeroFicha: '',
    programa: '',
    cuposDisponibles: 30,
    numeroAprendicesInscritos: 0,
    estado: 'EN_EJECUCION'
  };
  horarioSeleccionadoId?: number;

  // Formulario Horario
  nuevoHorario: Horario = {
    dias: 'LUNES_A_VIERNES',
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

  guardarHorario() {
    const dias = typeof this.nuevoHorario.dias === 'string'
      ? this.nuevoHorario.dias.split('_A_').flatMap(dia => dia.split(',')).map(dia => dia.trim().toUpperCase()).filter(Boolean)
      : this.nuevoHorario.dias;

    this.backendService.createHorario({ ...this.nuevoHorario, dias }).subscribe({
      next: () => {
        alert('Horario creado correctamente');
        this.cargarHorarios();
      },
      error: err => alert('Error al crear el horario')
    });
  }

  guardarFicha() {
    if (this.horarioSeleccionadoId) {
      this.nuevaFicha.horario = { idHorario: this.horarioSeleccionadoId } as Horario;
    }
    this.backendService.createFicha(this.nuevaFicha).subscribe({
      next: () => {
        alert('Ficha registrada con éxito');
        this.cargarFichas();
      },
      error: err => alert('Error al registrar la ficha: ' + (err.error || 'verifica los datos y el horario'))
    });
  }
}