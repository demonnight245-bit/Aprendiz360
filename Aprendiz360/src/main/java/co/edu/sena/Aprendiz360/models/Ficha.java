package co.edu.sena.Aprendiz360.models;

import co.edu.sena.Aprendiz360.enums.EstadoFicha;
import jakarta.persistence.*;

@Entity
@Table(name = "fichas")
public class Ficha {

    @Id
    private Long numeroFicha;

    private String programa;
    private String tipoFormacion;
    private Integer cuposDisponibles;
    private Integer numeroAprendicesInscritos = 0;

    @Enumerated(EnumType.STRING)
    private EstadoFicha estado;

    @ManyToOne
    @JoinColumn(name = "horario_id")
    private Horario horario;

    public Ficha() {
    }

    // Getters y Setters
    public Long getNumeroFicha() {
        return numeroFicha;
    }

    public void setNumeroFicha(Long numeroFicha) {
        this.numeroFicha = numeroFicha;
    }

    public String getPrograma() {
        return programa;
    }

    public void setPrograma(String programa) {
        this.programa = programa;
    }

    public String getTipoFormacion() {
        return tipoFormacion;
    }

    public void setTipoFormacion(String tipoFormacion) {
        this.tipoFormacion = tipoFormacion;
    }

    public Integer getCuposDisponibles() {
        return cuposDisponibles;
    }

    public void setCuposDisponibles(Integer cuposDisponibles) {
        this.cuposDisponibles = cuposDisponibles;
    }

    public Integer getNumeroAprendicesInscritos() {
        return numeroAprendicesInscritos;
    }

    public void setNumeroAprendicesInscritos(Integer numeroAprendicesInscritos) {
        this.numeroAprendicesInscritos = numeroAprendicesInscritos;
    }

    public EstadoFicha getEstado() {
        return estado;
    }

    public void setEstado(EstadoFicha estado) {
        this.estado = estado;
    }

    public Horario getHorario() {
        return horario;
    }

    public void setHorario(Horario horario) {
        this.horario = horario;
    }
}