package org.cours.modele;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.util.List;

@RepositoryRestResource
public interface VoitureRepo extends CrudRepository<Voiture, Long> {

    List<Voiture> findByMarque(@Param("marque") String marque);
    List<Voiture> findByCouleur(@Param("couleur") String couleur);
    List<Voiture> findByAnnee(@Param("annee") int annee);
    List<Voiture> findByMarqueAndModele(
        @Param("marque") String marque,
        @Param("modele") String modele);
}
