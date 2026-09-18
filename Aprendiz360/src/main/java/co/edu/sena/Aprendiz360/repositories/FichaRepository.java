package co.edu.sena.Aprendiz360.repositories;
import co.edu.sena.Aprendiz360.enums.EstadoFicha;
import co.edu.sena.Aprendiz360.models.Ficha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FichaRepository extends JpaRepository<Ficha, Long> {
    List<Ficha> findByEstado(EstadoFicha estado);
    long countByEstado(EstadoFicha estado);
}