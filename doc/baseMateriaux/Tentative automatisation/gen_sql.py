import pdfplumber
import re

# 1) Votre mapping section → cath_id (à ajuster si besoin)
mapping = {
    "Pierres et murs maçonnés":       11,
    "Bétons, éléments de maçonnerie": 11,
    "Terre, plâtres et autres conglomérats": 2,
    "Végétaux et isolants à base de végétaux": 6,
    "Isolants minéraux":               8,
    "Isolants synthétiques":           9,
    "Revêtement de sols":              2,
    "Autres matériaux":               11,
    "Fluides (air, argon…)":           3
}

# 2) Regex qui capture : ID, libellé, puis EXACTEMENT 4 champs numériques (avec slash et espaces autour)
num = r'[0-9]+(?:[.,][0-9]+)?(?:\s*/\s*[0-9]+(?:[.,][0-9]+)?)*'
pattern = re.compile(
    rf'^(\d+)\s+'          # 1) ID (on l'ignore)
    rf'(.+?)\s+'           # 2) libellé
    rf'({num})\s+'         # 3) p (masse volumique)
    rf'({num})\s+'         # 4) λ (conductivité)
    rf'({num})\s+'         # 5) c (chaleur spécifique)
    rf'({num})$'           # 6) μ (résistance vapeur)
)

records = []
with pdfplumber.open("bdd-materiaux-courgey-oliva-2021-04.pdf") as pdf:
    section = None
    for page in pdf.pages:
        for line in page.extract_text().split("\n"):
            txt = line.strip()
            # Basculer de section si le titre correspond
            if txt in mapping:
                section = txt
                continue
            m = pattern.match(txt)
            if not m:
                continue
            # On extrait juste les groupes utiles
            _, raw_lib, p, lam, c, mu = m.groups()
            lib = raw_lib.strip().replace("'", "''")
            # On garde les espaces autour des slash pour plus de lisibilité
            records.append({
                "libelle": lib,
                "cath_id": mapping.get(section, 11),
                "p": p.strip(),
                "lambda": lam.strip(),
                "c": c.strip(),
                "u": mu.strip()
            })

# 3) Génération du fichier SQL
with open("insert_materiaux_complet.sql", "w", encoding="utf-8") as out:
    for r in records:
        out.write(
            "INSERT INTO materiaux "
            "(status,libelle,cath_id,generique,`lambda`,p,c,u,source_libelle,source_link,contrib) VALUES "
            f"(5,'{r['libelle']}',{r['cath_id']},1,'{r['lambda']}','{r['p']}','{r['c']}','{r['u']}',"
            "'Arcanne',"
            "'https://associationarcanne.com/ressources/base-de-donnees-materiaux/',"
            "'import');\n"
        )

print(f"{len(records)} INSERT générés dans insert_materiaux_complet.sql")
