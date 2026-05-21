package org.cours.web;

import org.cours.service.VoitureAIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Contrôleur REST pour les fonctionnalités IA métier.
 * Toutes les routes sont préfixées /ai/
 */
@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class VoitureAIController {

    private final VoitureAIService aiService;

    public VoitureAIController(VoitureAIService aiService) {
        this.aiService = aiService;
    }

    /**
     * POST /ai/recommander
     * Body: { "budget": 90000, "usage": "ville et autoroute" }
     * Recommande une voiture du catalogue selon budget et usage.
     */
    @PostMapping("/recommander")
    public ResponseEntity<Map<String, String>> recommander(
            @RequestBody Map<String, Object> body) {
        int budget = (int) body.get("budget");
        String usage = (String) body.get("usage");
        String reponse = aiService.recommanderVoiture(budget, usage);
        return ResponseEntity.ok(Map.of("recommandation", reponse));
    }

    /**
     * GET /ai/estimer/{id}
     * Estime le prix de revente d'une voiture identifiée par son id.
     */
    @GetMapping("/estimer/{id}")
    public ResponseEntity<Map<String, String>> estimer(
            @PathVariable Long id) {
        String reponse = aiService.estimerPrixRevente(id);
        return ResponseEntity.ok(Map.of("estimation", reponse));
    }

    /**
     * GET /ai/description/{id}
     * Génère une fiche produit commerciale pour une voiture.
     */
    @GetMapping("/description/{id}")
    public ResponseEntity<Map<String, String>> description(
            @PathVariable Long id) {
        String reponse = aiService.genererDescriptionCommerciale(id);
        return ResponseEntity.ok(Map.of("description", reponse));
    }

    /**
     * POST /ai/chat
     * Body: { "question": "Quelle est la meilleure voiture pour une famille ?" }
     * Chatbot conseiller du magasin.
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @RequestBody Map<String, String> body) {
        String question = body.get("question");
        String reponse = aiService.conseillerChat(question);
        return ResponseEntity.ok(Map.of("reponse", reponse));
    }
}
