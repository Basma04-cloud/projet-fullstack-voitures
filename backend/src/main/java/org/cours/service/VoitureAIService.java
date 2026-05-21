package org.cours.service;

import org.cours.modele.Voiture;
import org.cours.modele.VoitureRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.stream.StreamSupport;

@Service
public class VoitureAIService {

    private final VoitureRepo voitureRepo;
    private final RestClient restClient;

    public VoitureAIService(VoitureRepo voitureRepo) {
        this.voitureRepo = voitureRepo;
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:11434")
                .build();
    }
    private String callOllama(String prompt) {
        try {
            String escaped = prompt
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "");

            String body = "{\"model\":\"llama3\",\"prompt\":\""
                    + escaped + "\",\"stream\":false}";

            String response = restClient.post()
                    .uri("/api/generate")
                    .header("Content-Type", "application/json")
                    .body(body)
                    .retrieve()
                    .body(String.class);

            if (response != null && response.contains("\"response\":\"")) {
                int start = response.indexOf("\"response\":\"") + 12;
                int end = response.indexOf("\",\"done\"");
                if (start > 12 && end > start) {
                    return response.substring(start, end)
                            .replace("\\n", "\n")
                            .replace("\\\"", "\"")
                            .replace("\\\\", "\\");
                }
            }
            return "Réponse reçue mais non parsée.";

        } catch (Exception e) {
            return "Erreur IA : vérifiez qu'Ollama est démarré. " + e.getMessage();
        }
    }

    public String recommanderVoiture(int budget, String usage) {
        List<Voiture> voitures = StreamSupport
                .stream(voitureRepo.findAll().spliterator(), false)
                .toList();
        StringBuilder catalogue = new StringBuilder();
        for (Voiture v : voitures) {
            catalogue.append(String.format("- %s %s (%d), %s, %d DH\\n",
                    v.getMarque(), v.getModele(), v.getAnnee(),
                    v.getCouleur(), v.getPrix()));
        }
        String prompt = "Tu es conseiller automobile. Catalogue : "
                + catalogue
                + "Client : budget " + budget + " DH, usage : " + usage
                + ". Recommande la meilleure option avec 3 arguments. Reponds en francais.";
        return callOllama(prompt);
    }

    public String estimerPrixRevente(Long id) {
        Voiture v = voitureRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Voiture introuvable : " + id));
        int age = java.time.Year.now().getValue() - v.getAnnee();
        String prompt = "Expert automobile. Estime le prix de revente au Maroc de : "
                + v.getMarque() + " " + v.getModele()
                + ", " + age + " ans, " + v.getCouleur()
                + ", prix initial " + v.getPrix() + " DH. "
                + "Donne une fourchette basse/haute avec justification. En francais.";
        return callOllama(prompt);
    }

    public String genererDescriptionCommerciale(Long id) {
        Voiture v = voitureRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Voiture introuvable : " + id));
        String prompt = "Redacteur pub automobile. Genere une fiche produit pour : "
                + v.getMarque() + " " + v.getModele() + " " + v.getAnnee()
                + ", " + v.getCouleur() + ", " + v.getPrix() + " DH. "
                + "Inclus titre, description, points forts, appel a l'action. En francais.";
        return callOllama(prompt);
    }

    public String conseillerChat(String question) {
        String prompt = "Tu es l'assistant du Magasin de Voitures MIOLA. "
                + "Reponds en francais de facon professionnelle. Question : " + question;
        return callOllama(prompt);
    }
}