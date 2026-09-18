package co.edu.sena.Aprendiz360.controllers;

import co.edu.sena.Aprendiz360.models.Ficha;
import co.edu.sena.Aprendiz360.services.FichaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fichas")
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:4300" })
public class FichaController {

    @Autowired
    private FichaService fichaService;

    @GetMapping
    public ResponseEntity<List<Ficha>> listar() {
        return ResponseEntity.ok(fichaService.listarTodas());
    }

    @GetMapping("/{numeroFicha}")
    public ResponseEntity<?> obtenerPorNumeroFicha(@PathVariable Long numeroFicha) {
        return fichaService.buscarPorNumeroFicha(numeroFicha)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Ficha ficha) {
        try {
            Ficha nueva = fichaService.guardar(ficha);
            return new ResponseEntity<>(nueva, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{numeroFicha}")
    public ResponseEntity<?> actualizar(@PathVariable Long numeroFicha, @RequestBody Ficha ficha) {
        try {
            Ficha actualizada = fichaService.actualizar(numeroFicha, ficha);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{numeroFicha}")
    public ResponseEntity<?> eliminar(@PathVariable Long numeroFicha) {
        try {
            fichaService.eliminar(numeroFicha);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}