package org.cours.modele;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Data
@RequiredArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class Voiture {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NonNull private String marque;
    @NonNull private String modele;
    @NonNull private String couleur;
    @NonNull private String immatricule;
    @NonNull private Integer annee;
    @NonNull private Integer prix;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "proprietaire_id")
    @JsonIgnore
    private Proprietaire proprietaire;
}
