import { Horario } from './horario.model';

export interface Ficha {
    id?: number;
    numeroFicha: string;
    programa: string;
    cuposDisponibles: number;
    numeroAprendicesInscritos: number;
    estado: 'EN_EJECUCION' | 'FINALIZADO';
    horario?: Horario;
}