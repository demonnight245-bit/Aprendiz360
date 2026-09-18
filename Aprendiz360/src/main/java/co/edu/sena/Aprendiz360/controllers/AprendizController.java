package co.edu.sena.Aprendiz360.controllers;

import co.edu.sena.Aprendiz360.models.Aprendiz;
import co.edu.sena.Aprendiz360.services.AprendizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/aprendices")
@CrossOrigin(origins = "http://localhost:4200")
public class AprendizController {

    @Autowired
    private AprendizService aprendizService;

    @GetMapping
    public ResponseEntity<List<Aprendiz>> listar() {
        return ResponseEntity.ok(aprendizService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return aprendizService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ficha/{numeroFicha}")
    public ResponseEntity<List<Aprendiz>> obtenerPorFicha(@PathVariable Long numeroFicha) {
        return ResponseEntity.ok(aprendizService.obtenerPorFicha(numeroFicha));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        return ResponseEntity.ok(aprendizService.obtenerEstadisticasDashboard());
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Aprendiz aprendiz) {
        try {
            Aprendiz nuevo = aprendizService.registrarAprendiz(aprendiz);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Aprendiz aprendiz) {
        try {
            Aprendiz actualizado = aprendizService.actualizar(id, aprendiz);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            aprendizService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}