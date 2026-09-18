package co.edu.sena.Aprendiz360.services;

import co.edu.sena.Aprendiz360.models.Horario;
import co.edu.sena.Aprendiz360.repositories.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HorarioService {

    @Autowired
    private HorarioRepository horarioRepository;

    public List<Horario> listarTodos() {
        return horarioRepository.findAll();
    }

    public Optional<Horario> buscarPorId(Long id) {
        return horarioRepository.findById(id);
    }

    public Horario guardar(Horario horario) {
        if (horario.getHoraEntrada() != null && horario.getHoraSalida() != null) {
            if (horario.getHoraSalida().isBefore(horario.getHoraEntrada())) {
                throw new RuntimeException("La hora de salida no puede ser anterior a la hora de entrada.");
            }
        }
        return horarioRepository.save(horario);
    }

    public Horario actualizar(Long id, Horario horarioDetalles) {
        Horario horario = horarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado con el ID: " + id));

        horario.setDias(horarioDetalles.getDias());
        horario.setHoraEntrada(horarioDetalles.getHoraEntrada());
        horario.setHoraSalida(horarioDetalles.getHoraSalida());

        return horarioRepository.save(horario);
    }

    public void eliminar(Long id) {
        Horario horario = horarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado con el ID: " + id));
        horarioRepository.delete(horario);
    }
}