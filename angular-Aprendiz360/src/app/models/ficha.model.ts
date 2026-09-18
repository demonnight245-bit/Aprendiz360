import { Horario } from './horario.model';

export interface Ficha {
    id?: number;
    numeroFicha: number | string;
    programa: string;
    tipoFormacion: 'TECNICO' | 'TECNOLOGO' | 'CURSO';
    cuposDisponibles: number;
    numeroAprendicesInscritos: number;
    estado: 'EN_EJECUCION' | 'FINALIZADO';
    horario?: Horario;
}