import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horario } from '../models/horario.model';
import { Ficha } from '../models/ficha.model';
import { Aprendiz } from '../models/aprendiz.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // --- HORARIOS ---
  getHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/horarios`);
  }
  createHorario(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(`${this.apiUrl}/horarios`, horario);
  }
  updateHorario(id: number, horario: Horario): Observable<Horario> {
    return this.http.put<Horario>(`${this.apiUrl}/horarios/${id}`, horario);
  }
  deleteHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/horarios/${id}`);
  }

  // --- FICHAS ---
  getFichas(): Observable<Ficha[]> {
    return this.http.get<Ficha[]>(`${this.apiUrl}/fichas`);
  }
  createFicha(ficha: Ficha): Observable<Ficha> {
    return this.http.post<Ficha>(`${this.apiUrl}/fichas`, ficha);
  }
  updateFicha(numeroFicha: number | string, ficha: Ficha): Observable<Ficha> {
    return this.http.put<Ficha>(`${this.apiUrl}/fichas/${numeroFicha}`, ficha);
  }
  deleteFicha(numeroFicha: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/fichas/${numeroFicha}`);
  }

  // --- APRENDICES ---
  getAprendices(): Observable<Aprendiz[]> {
    return this.http.get<Aprendiz[]>(`${this.apiUrl}/aprendices`);
  }
  getAprendicesPorFicha(fichaId: number): Observable<Aprendiz[]> {
    return this.http.get<Aprendiz[]>(`${this.apiUrl}/aprendices/ficha/${fichaId}`);
  }
  createAprendiz(aprendiz: Aprendiz): Observable<Aprendiz> {
    return this.http.post<Aprendiz>(`${this.apiUrl}/aprendices`, aprendiz);
  }
  updateAprendiz(id: number, aprendiz: Aprendiz): Observable<Aprendiz> {
    return this.http.put<Aprendiz>(`${this.apiUrl}/aprendices/${id}`, aprendiz);
  }
  deleteAprendiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/aprendices/${id}`);
  }

  // --- DASHBOARD / METRICAS ---
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/aprendices/dashboard/stats`);
  }
}