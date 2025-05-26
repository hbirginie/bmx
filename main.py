import random


# === PARAMÈTRES GÉNÉRAUX DE LA COMPÉTITION ===

participants= [ "Liam", "Noah", "Ethan", "Mason", "Logan", "Lucas", "Jackson", "Aiden",
        "Oliver", "Jacob", "Elijah", "Alexander", "James", "Benjamin", "Daniel", "Matthew",
        "Jayden", "Michael", "Carter", "Sebastian", "Jack", "Owen"]

TAILLE_RACE = 8
NB_QUALIFIES_PAR_RACE= 4
NB_MANCHES = 2


# === FONCTIONS ===


def saisir_participants():
    participants = []
    print("Entrez les noms des participants (tape 'fin' pour terminer) :")
    while True:
        nom = input("Nom du participant : ")
        if nom.lower() == "fin":
            break
        elif nom.strip() == "":
            continue
        participants.append(nom.strip())
    return participants


def generer_races(participants):
    if len(participants) <= 16:
        nb_races = 2
    elif len(participants) <= 24:
        nb_races = 3
    else:
        nb_races = 4

    random.shuffle(participants)

    races = [[] for _ in range(nb_races)]
    for i, participant in enumerate(participants):
        races[i % nb_races].append(participant)

    return races


def afficher_race(i, races):
    print(f"\n--- Race numéro {i + 1} ---")
    for coureur in races[i]:
        print(f"- {coureur}")



def resultat_race_manuelle(race):
    scores = {}
    places_attribuees = set()
    place_auto = 1
    index_coureur = 0

    print("Participants :", ", ".join(race))

    while index_coureur < len(race):
        coureur = race[index_coureur]
        entree = input(f"Place de {coureur}: ").strip().lower()

        if entree == 'r':
            for i in range(index_coureur, len(race)):
                scores[race[i]] = place_auto
                print(f"{race[i]} : {place_auto}")
                place_auto += 1
            break

        else:
            try:
                place = int(entree)
                if 1 <= place <= len(race) and place not in places_attribuees:
                    scores[coureur] = place
                    places_attribuees.add(place)
                    index_coureur += 1
                else:
                    print("Place invalide ou déjà prise. Réessaie.")
            except ValueError:
                print("Entrée invalide, tape un nombre ou 'r'.")

    print("\n--- Classement de la manche ---")
    classement = sorted(scores.items(), key=lambda x: x[1])
    for nom, pts in classement:
        print(f"{pts}ᵉ : {nom} (+{pts} pts)")

    return scores


def somme_scores(*scores_list):
    somme = {}
    for scores in scores_list:
        for coureur, pts in scores.items():
            somme[coureur] = somme.get(coureur, 0) + pts
    return somme

def classement_par_points(total_scores):
    classement = sorted(total_scores.items(), key=lambda x: x[1])
    return [coureur for coureur, pts in classement]


def lancer_qualif(races):
    scores_par_race = [{} for _ in races]

    for manche in range(1, NB_MANCHES + 1):
        print(f"\n=== Manche {manche} pour toutes les courses ===")
        for i, race in enumerate(races):
            print(f"\nRace {i + 1}:")
            manche_scores = resultat_race_manuelle(race)
            print(manche_scores) # <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            for coureur, pts in manche_scores.items():
                scores_par_race[i][coureur] = scores_par_race[i].get(coureur, 0) + pts

    classements_tous = []
    for scores in scores_par_race:
        print("\nTotal des scores cumulés sur toutes les manches :")
        classement = classement_par_points(scores)
        for coureur in classement:
            print(f"{coureur} : {scores[coureur]} pts")
        classements_tous.append(classement)

    return classements_tous



def fusionner_classés(listes):
    fusion = []
    max_len = max(len(liste) for liste in listes)

    for i in range(max_len):
        for liste in listes:
            if i < len(liste):
                fusion.append(liste[i])
    return fusion


def generer_demi_et_consolantes(res_qualifs):
    demi1 = []
    demi2 = []
    consolante1 = []
    consolante2 = []
    
    nb_races = len(res_qualifs)
    classement_qualif = fusionner_classés(res_qualifs)
    
    i = 0
    while i < NB_QUALIFIES_PAR_RACE * nb_races:
        if i % 2 == 0:
            demi1.append(classement_qualif[i])
        else:
            demi2.append(classement_qualif[i])
        i+=1
        
    while i < len(classement_qualif):
        if i % 2 == 0:
            consolante1.append(classement_qualif[i])
        else:
            consolante2.append(classement_qualif[i])
        i+=1

    return demi1, demi2, consolante1, consolante2


def fusion_alternée(l1, l2):
        fusion = []
        for i in range(max(len(l1), len(l2))):
            if i < len(l1):
                fusion.append(l1[i])
            if i < len(l2):
                fusion.append(l2[i])
        return fusion


def lancer_demi_consolantes(demi1, demi2, consol1, consol2):
    print(f"\n=== Demi finale 1 ===")
    score_d1 = resultat_race_manuelle(demi1)
    print(score_d1) # <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    print(f"\n=== Demi finale 2 ===")
    score_d2 = resultat_race_manuelle(demi2)
    print(score_d2) # <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    print(f"\n=== Consolante 1 ===")
    score_c1 = resultat_race_manuelle(consol1)
    print(score_c1) # <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    print(f"\n=== Consolante 2 ===")
    score_c2 = resultat_race_manuelle(consol2)
    print(score_c2) # <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    classement_d1 = classement_par_points(score_d1)
    classement_d2 = classement_par_points(score_d2)
    classement_c1 = classement_par_points(score_c1)
    classement_c2 = classement_par_points(score_c2)
    
    demi_finale_classée = fusion_alternée(classement_d1, classement_d2)
    consolante_classée = fusion_alternée(classement_c1, classement_c2)
    
    return demi_finale_classée + consolante_classée


def generer_finales(res_demi):
    finales = []
    for i in range(0, len(res_demi), TAILLE_RACE):
        finales.append(res_demi[i:i+TAILLE_RACE])
    return finales

    
def lancer_finales(finales):
    res_course = []
    lettres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    for i, f in enumerate(finales):
        print(f"\n=== Finale {lettres[i]} ===")
        res_course.append(resultat_race_manuelle(f))

    return res_course



# === LANCEMENT ===


if __name__ == "__main__":
    
    #participants = saisir_participants()
    print(f"Il y a {len(participants)} participants.")
    races = generer_races(participants)
    #for i in range(len(races)):
        #afficher_race(i, races)
    res_qualif = lancer_qualif(races)
    demi1, demi2, consol1, consol2 = generer_demi_et_consolantes(res_qualif)
    res_demis = lancer_demi_consolantes(demi1, demi2, consol1, consol2)
    finales = generer_finales(res_demis)
    course = lancer_finales(finales)
    print(course) # <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    
