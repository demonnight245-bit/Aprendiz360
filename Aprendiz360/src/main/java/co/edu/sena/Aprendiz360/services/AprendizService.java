package co.edu.sena.Aprendiz360.services;

import co.edu.sena.Aprendiz360.enums.EstadoAprendiz;
import co.edu.sena.Aprendiz360.enums.EstadoFicha;
import co.edu.sena.Aprendiz360.models.Aprendiz;
import co.edu.sena.Aprendiz360.models.Ficha;
import co.edu.sena.Aprendiz360.repositories.AprendizRepository;
import co.edu.sena.Aprendiz360.repositories.FichaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AprendizService {

    @Autowired
    private AprendizRepository aprendizRepository;

    @Autowired
    private FichaRepository fichaRepository;

    public List<Aprendiz> listarTodos() {
        return aprendizRepository.findAll();
    }

    public Optional<Aprendiz> buscarPorId(Long id) {
        return aprendizRepository.findById(id);
    }

    public List<Aprendiz> obtenerPorFicha(Long numeroFicha) {
        return aprendizRepository.findByFichaNumeroFicha(numeroFicha);
    }

    @Transactional
    public Aprendiz registrarAprendiz(Aprendiz aprendiz) {
        if (aprendiz.getFicha() == null || aprendiz.getFicha().getNumeroFicha() == null) {
            throw new RuntimeException("El aprendiz debe estar asignado a una ficha.");
        }

        Ficha ficha = fichaRepository.findById(aprendiz.getFicha().getNumeroFicha())
                .orElseThrow(() -> new RuntimeException("La ficha asignada no existe."));

        // Reglas de negocio
        if (ficha.getEstado() == EstadoFicha.FINALIZADO) {
            throw new RuntimeException("No se puede inscribir un aprendiz a una ficha en estado FINALIZADO.");
        }

        if (ficha.getCuposDisponibles() <= 0) {
            throw new RuntimeException("No hay cupos disponibles en esta ficha.");
        }

        // Actualización de contadores de la ficha
        ficha.setCuposDisponibles(ficha.getCuposDisponibles() - 1);
        ficha.setNumeroAprendicesInscritos(ficha.getNumeroAprendicesInscritos() + 1);
        fichaRepository.save(ficha);

        aprendiz.setFicha(ficha);
        if (aprendiz.getEstado() == null) {
            aprendiz.setEstado(EstadoAprendiz.ACTIVO);
        }

        return aprendizRepository.save(aprendiz);
    }

    public Aprendiz actualizar(Long id, Aprendiz aprendizDetalles) {
        Aprendiz aprendiz = aprendizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aprendiz no encontrado con el ID: " + id));

        aprendiz.setNombre(aprendizDetalles.getNombre());
        aprendiz.setNumeroIdentificacion(aprendizDetalles.getNumeroIdentificacion());
        aprendiz.setEdad(aprendizDetalles.getEdad());
        aprendiz.setEstado(aprendizDetalles.getEstado());
        aprendiz.setPaisOrigen(aprendizDetalles.getPaisOrigen());

        return aprendizRepository.save(aprendiz);
    }

    public void eliminar(Long id) {
        Aprendiz aprendiz = aprendizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aprendiz no encontrado con el ID: " + id));
        aprendizRepository.delete(aprendiz);
    }

    // Datos para el Dashboard (Numeral 15 de la guía)
    public Map<String, Object> obtenerEstadisticasDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAprendices", aprendizRepository.count());
        stats.put("aprendicesActivos", aprendizRepository.countByEstado(EstadoAprendiz.ACTIVO));
        stats.put("totalFichas", fichaRepository.count());
        stats.put("fichasEnEjecucion", fichaRepository.countByEstado(EstadoFicha.EN_EJECUCION));
        return stats;
    }
}