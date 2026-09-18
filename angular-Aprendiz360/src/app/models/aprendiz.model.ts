import { Ficha } from './ficha.model';

export interface Aprendiz {
    id?: number;
    nombre: string;
    numeroIdentificacion: string;
    edad: number;
    estado: 'ACTIVO' | 'INACTIVO';
    ficha?: Ficha;
    paisOrigen?: string; // Dato integrado de API Externa
}