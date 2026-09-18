package co.edu.sena.Aprendiz360.repositories;

import co.edu.sena.Aprendiz360.enums.EstadoAprendiz;
import co.edu.sena.Aprendiz360.models.Aprendiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AprendizRepository extends JpaRepository<Aprendiz, Long> {
    List<Aprendiz> findByFichaNumeroFicha(Long numeroFicha);
    Optional<Aprendiz> findByNumeroIdentificacion(String numeroIdentificacion);
    long countByEstado(EstadoAprendiz estado);
}