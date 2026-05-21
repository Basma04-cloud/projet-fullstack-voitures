package org.cours.service;

import org.cours.modele.Voiture;
import org.cours.modele.VoitureRepo;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.StreamSupport;

/**
 * Service IA métier - Intégration d'Ollama pour des fonctionnalités
 * intelligentes autour du magasin de voitures.
 *
 * Fonctionnalités IA :
 *   1. Recommandation de voiture selon le budget et les préférences
 *   2. Estimation du prix de revente d'une voiture
 *   3. Analyse et description automatique d'une voiture
 *   4. Conseil d'achat personnalisé
 */
@Service
public class VoitureAIService {

    private final ChatClient chatClient;
    private final VoitureRepo voitureRepo;

    public VoitureAIService(ChatClient.Builder builder,
                            VoitureRepo voitureRepo) {
        this.chatClient = builder.build();
        this.voitureRepo = voitureRepo;
    }

    /**
     * 1. RECOMMANDATION INTELLIGENTE
     * Recommande une voiture du catalogue selon le budget et les besoins.
     */
    public String recommanderVoiture(int budget, String usage) {
        List<Voiture> voitures = StreamSupport
            .stream(voitureRepo.findAll().spliterator(), false)
            .toList();

        String catalogue = voitures.stream()
            .map(v -> String.format("- %s %s (%d), couleur %s, prix %d DH",
                v.getMarque(), v.getModele(), v.getAnnee(),
                v.getCouleur(), v.getPrix()))
            .reduce("", (a, b) -> a + "\n" + b);

        String prompt = String.format("""
            Tu es un conseiller expert en vente de voitures au Maroc.
            
            Voici le catalogue des voitures disponibles dans notre magasin :
            %s
            
            Un client cherche une voiture pour un usage : %s
            Son budget maximum est de %d DH.
            
            Recommande-lui la meilleure option parmi notre catalogue,
            explique pourquoi c'est le meilleur choix pour lui,
            et donne 2-3 arguments de vente convaincants.
            Réponds en français, de façon professionnelle et chaleureuse.
            """, catalogue, usage, budget);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    /**
     * 2. ESTIMATION DU PRIX DE REVENTE
     * Analyse la valeur marchande d'une voiture selon ses caractéristiques.
     */
    public String estimerPrixRevente(Long voitureId) {
        Voiture v = voitureRepo.findById(voitureId)
            .orElseThrow(() -> new RuntimeException(
                "Voiture introuvable : " + voitureId));

        int anneeActuelle = java.time.Year.now().getValue();
        int age = anneeActuelle - v.getAnnee();

        String prompt = String.format("""
            Tu es un expert en évaluation automobile au Maroc.
            
            Voiture à évaluer :
            - Marque / Modèle : %s %s
            - Année : %d (âge : %d ans)
            - Couleur : %s
            - Prix d'achat initial : %d DH
            
            Donne une estimation réaliste du prix de revente actuel
            sur le marché marocain, avec une fourchette basse et haute.
            Explique les facteurs qui influencent cette estimation
            (dépréciation, popularité de la marque, disponibilité des pièces).
            Réponds en français de façon structurée.
            """, v.getMarque(), v.getModele(), v.getAnnee(),
                age, v.getCouleur(), v.getPrix());

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    /**
     * 3. DESCRIPTION COMMERCIALE AUTOMATIQUE
     * Génère une fiche produit attractive pour une voiture.
     */
    public String genererDescriptionCommerciale(Long voitureId) {
        Voiture v = voitureRepo.findById(voitureId)
            .orElseThrow(() -> new RuntimeException(
                "Voiture introuvable : " + voitureId));

        String prompt = String.format("""
            Tu es un rédacteur publicitaire spécialisé dans l'automobile.
            
            Génère une fiche produit commerciale attractive pour :
            - Marque : %s
            - Modèle : %s
            - Année : %d
            - Couleur : %s
            - Prix : %d DH
            - Immatriculation : %s
            
            La fiche doit inclure :
            1. Un titre accrocheur
            2. Une description séduisante (3-4 phrases)
            3. Les points forts supposés de ce modèle
            4. Un appel à l'action pour l'acheteur
            
            Écris en français, style commercial professionnel.
            """, v.getMarque(), v.getModele(), v.getAnnee(),
                v.getCouleur(), v.getPrix(), v.getImmatricule());

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    /**
     * 4. CHATBOT CONSEILLER
     * Répond à n'importe quelle question liée au magasin/aux voitures.
     */
    public String conseillerChat(String question) {
        long totalVoitures = voitureRepo.count();

        String prompt = String.format("""
            Tu es l'assistant IA du Magasin de Voitures MIOLA.
            Notre catalogue contient actuellement %d voitures.
            Tu réponds aux questions des clients en français,
            de façon professionnelle, utile et concise.
            
            Question du client : %s
            """, totalVoitures, question);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}
