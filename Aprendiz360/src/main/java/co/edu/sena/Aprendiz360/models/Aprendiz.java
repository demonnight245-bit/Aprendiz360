package co.edu.sena.Aprendiz360.models;

import co.edu.sena.Aprendiz360.enums.EstadoAprendiz;
import jakarta.persistence.*;

@Entity
@Table(name = "aprendices")
public class Aprendiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    @Column(unique = true, nullable = false)
    private String numeroIdentificacion;
    private Integer edad;
    private String paisOrigen; // Campo para guardar el dato obtenido de la API externa

    @Enumerated(EnumType.STRING)
    private EstadoAprendiz estado;

    @ManyToOne
    @JoinColumn(name = "ficha_id")
    private Ficha ficha;

    public Aprendiz() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getNumeroIdentificacion() { return numeroIdentificacion; }
    public void setNumeroIdentificacion(String numeroIdentificacion) { this.numeroIdentificacion = numeroIdentificacion; }
    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }
    public String getPaisOrigen() { return paisOrigen; }
    public void setPaisOrigen(String paisOrigen) { this.paisOrigen = paisOrigen; }
    public EstadoAprendiz getEstado() { return estado; }
    public void setEstado(EstadoAprendiz estado) { this.estado = estado; }
    public Ficha getFicha() { return ficha; }
    public void setFicha(Ficha ficha) { this.ficha = ficha; }
}