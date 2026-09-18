package co.edu.sena.Aprendiz360.services;

import co.edu.sena.Aprendiz360.enums.EstadoFicha;
import co.edu.sena.Aprendiz360.models.Ficha;
import co.edu.sena.Aprendiz360.models.Horario;
import co.edu.sena.Aprendiz360.repositories.FichaRepository;
import co.edu.sena.Aprendiz360.repositories.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FichaService {

    @Autowired
    private FichaRepository fichaRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    public List<Ficha> listarTodas() {
        return fichaRepository.findAll();
    }

    public Optional<Ficha> buscarPorNumeroFicha(Long numeroFicha) {
        return fichaRepository.findById(numeroFicha);
    }

    public Ficha guardar(Ficha ficha) {
        if (ficha.getHorario() == null || ficha.getHorario().getIdHorario() == null) {
            throw new RuntimeException("Toda ficha debe tener un horario asignado.");
        }
        Horario horario = horarioRepository.findById(ficha.getHorario().getIdHorario())
                .orElseThrow(() -> new RuntimeException("El horario asignado no existe."));

        ficha.setHorario(horario);
        if (ficha.getNumeroAprendicesInscritos() == null) {
            ficha.setNumeroAprendicesInscritos(0);
        }
        if (ficha.getEstado() == null) {
            ficha.setEstado(EstadoFicha.EN_EJECUCION);
        }
        return fichaRepository.save(ficha);
    }

    public Ficha actualizar(Long numeroFicha, Ficha fichaDetalles) {
        Ficha ficha = fichaRepository.findById(numeroFicha)
                .orElseThrow(() -> new RuntimeException("Ficha no encontrada con el número: " + numeroFicha));

        ficha.setPrograma(fichaDetalles.getPrograma());
        ficha.setTipoFormacion(fichaDetalles.getTipoFormacion());
        ficha.setCuposDisponibles(fichaDetalles.getCuposDisponibles());
        ficha.setEstado(fichaDetalles.getEstado());

        if (fichaDetalles.getHorario() != null && fichaDetalles.getHorario().getIdHorario() != null) {
            Horario horario = horarioRepository.findById(fichaDetalles.getHorario().getIdHorario())
                    .orElseThrow(() -> new RuntimeException("El horario especificado no existe."));
            ficha.setHorario(horario);
        }

        return fichaRepository.save(ficha);
    }

    public void eliminar(Long numeroFicha) {
        Ficha ficha = fichaRepository.findById(numeroFicha)
                .orElseThrow(() -> new RuntimeException("Ficha no encontrada con el número: " + numeroFicha));
        fichaRepository.delete(ficha);
    }
}