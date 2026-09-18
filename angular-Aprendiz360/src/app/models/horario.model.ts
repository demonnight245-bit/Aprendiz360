export interface Horario {
    idHorario?: number;
    dias: string | string[]; // ej: "LUNES_A_VIERNES" o ["LUNES", "VIERNES"]
    horaEntrada: string; // ej: "07:00"
    horaSalida: string; // ej: "13:00"
}