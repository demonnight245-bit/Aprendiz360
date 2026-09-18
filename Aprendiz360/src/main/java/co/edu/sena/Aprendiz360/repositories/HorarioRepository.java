package co.edu.sena.Aprendiz360.repositories;
import co.edu.sena.Aprendiz360.models.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {
}