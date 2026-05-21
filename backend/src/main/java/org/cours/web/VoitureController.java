package org.cours.web;

import org.cours.modele.Voiture;
import org.cours.modele.VoitureRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class VoitureController {

    @Autowired
    private VoitureRepo voitureRepo;

    // GET toutes les voitures
    @RequestMapping("/voitures")
    public Iterable<Voiture> getVoitures() {
        return voitureRepo.findAll();
    }

    // GET une voiture par id
    @GetMapping("/voitures/{id}")
    public ResponseEntity<Voiture> getVoiture(@PathVariable Long id) {
        return voitureRepo.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // POST créer une voiture
    @PostMapping("/voitures")
    public Voiture saveVoiture(@RequestBody Voiture voiture) {
        return voitureRepo.save(voiture);
    }

    // PUT modifier une voiture
    @PutMapping("/voitures/{id}")
    public ResponseEntity<Voiture> updateVoiture(
            @PathVariable Long id,
            @RequestBody Voiture voiture) {
        return voitureRepo.findById(id).map(existing -> {
            existing.setMarque(voiture.getMarque());
            existing.setModele(voiture.getModele());
            existing.setCouleur(voiture.getCouleur());
            existing.setImmatricule(voiture.getImmatricule());
            existing.setAnnee(voiture.getAnnee());
            existing.setPrix(voiture.getPrix());
            return ResponseEntity.ok(voitureRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE supprimer une voiture
    @DeleteMapping("/voitures/{id}")
    public ResponseEntity<Void> deleteVoiture(@PathVariable Long id) {
        if (!voitureRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        voitureRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
