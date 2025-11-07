#!/usr/bin/env python3
"""Génère un CSV de correction pour le quiz méthode G.

Usage
-----
    python doc/evaluationG/correction.py doc/evaluationG/etude_sur_methode_g_dans_le_dimensionnement_dun_poele_de_masse.csv
     [chemin_sortie]

Le script lit l'export Framaform (CSV séparé par des points-virgules) et
produit un CSV de correction contenant, pour chaque participant, une ligne
avec :

* l'adresse e-mail du répondant ;
* pour chaque cas étudié : la réponse textuelle, la valeur de G extraite,
  les valeurs de référence (G calculé et G retenu) issues de
  ``methode_reverse.md``, le lien vers la correction détaillée, la puissance
  attendue (kW), la puissance déduite du G saisi (kW), l'écart (kW) et un
  commentaire qualitatif (« Impec » / « Presque » / « Outch »).

Le fichier de sortie est ``<input>_corrige.csv`` par défaut.
"""

from __future__ import annotations

import csv
import math
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple


@dataclass(frozen=True)
class CaseReference:
    slug: str
    question: str
    g_calcule: float
    g_retenu: float
    volume_m3: float
    delta_t: float
    phi_reference_kw: float
    search_url: str


CASES: Tuple[CaseReference, ...] = (
    CaseReference(
        slug="chalet_fuste",
        question="Déterminer le G de ce chalet en fuste",
        g_calcule=0.828,
        g_retenu=0.80,
        volume_m3=151.2,
        delta_t=25.0,
        phi_reference_kw=3.024,
        search_url="https://formation.poeledemasse.org/?s=sQBDienalk4Fy2hA",
    ),
    CaseReference(
        slug="maison_paille_avec_serre",
        question="Déterminer le G de cette maison en paille",
        g_calcule=0.310,
        g_retenu=0.30,
        volume_m3=510.0,
        delta_t=25.0,
        phi_reference_kw=3.825,
        search_url="https://formation.poeledemasse.org/?s=FeGsb9VgWO3JN7YS",
    ),
    CaseReference(
        slug="maison_annee_90",
        question="Déterminer le G de cette maison des années 90",
        g_calcule=0.932,
        g_retenu=0.90,
        volume_m3=351.0,
        delta_t=25.0,
        phi_reference_kw=7.898,
        search_url="https://formation.poeledemasse.org/?s=xVv3Ka6Bs2QWo8M1",
    ),
    CaseReference(
        slug="renovation_ancienne_bergerie",
        question="Déterminer le G de cette rénovation de bergerie",
        g_calcule=1.009,
        g_retenu=1.10,
        volume_m3=270.0,
        delta_t=24.0,
        phi_reference_kw=7.128,
        search_url="https://formation.poeledemasse.org/?s=D1Nr6imIuTCXL5la",
    ),
    CaseReference(
        slug="renovation_ite",
        question="Déterminer le G de cette rénovation ITE",
        g_calcule=0.831,
        g_retenu=0.80,
        volume_m3=351.0,
        delta_t=25.0,
        phi_reference_kw=7.020,
        search_url="https://formation.poeledemasse.org/?s=tplMmY3zryaoJwnF",
    ),
    CaseReference(
        slug="renovation_ite_isole_au_sol",
        question="Déterminer le G de cette rénovation ITE + isolation au sol",
        g_calcule=0.245,
        g_retenu=0.22,
        volume_m3=351.0,
        delta_t=25.0,
        phi_reference_kw=1.931,
        search_url="https://formation.poeledemasse.org/?s=rHlj0mqkNP6dAauT",
    ),
    CaseReference(
        slug="renovation_iti_avec_etage",
        question="Déterminer le G de cette rénovation ITI avec étage",
        g_calcule=0.583,
        g_retenu=0.50,
        volume_m3=300.0,
        delta_t=24.0,
        phi_reference_kw=3.600,
        search_url="https://formation.poeledemasse.org/?s=ZFuLgSTjNb54ehtW",
    ),
    CaseReference(
        slug="renovation_maison_bourg_mitoyennete",
        question="Déterminer le G de cette maison de bourg avec mitoyenneté",
        g_calcule=0.482,
        g_retenu=0.50,
        volume_m3=350.0,
        delta_t=24.0,
        phi_reference_kw=4.200,
        search_url="https://formation.poeledemasse.org/?s=Renovation-maison-de-bourg-avec-Mitoyennete_990",
    ),
)


HEADER_PREFIX = "Séquentiel"
EMAIL_COLUMN = "Votre adresse e-mail"


def parse_export(path: Path) -> Tuple[List[str], List[List[str]]]:
    """Retourne l'en-tête et les données utiles du fichier Framaform.

    Le fichier commence par deux lignes descriptives qu'il faut ignorer. On
    cherche l'en-tête commençant par ``HEADER_PREFIX`` puis on lit les lignes
    suivantes.
    """

    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.reader(handle, delimiter=";")
        header: Optional[List[str]] = None
        rows: List[List[str]] = []

        for row in reader:
            if not row:
                continue
            if header is None:
                if row[0] == HEADER_PREFIX:
                    header = row
                continue
            else:
                rows.append(row)

    if header is None:
        raise ValueError(
            f"Impossible de trouver l'en-tête '{HEADER_PREFIX}' dans {path}"
        )

    return header, rows


def extract_g_value(answer: str) -> Optional[float]:
    """Extrait la valeur numérique d'un G à partir du texte de réponse."""

    if not answer:
        return None

    match = re.search(r"G\s*=\s*([0-9]+(?:[\.,][0-9]+)?)", answer)
    if not match:
        return None

    value = match.group(1).replace(",", ".")
    try:
        return float(value)
    except ValueError:
        return None


def comment_for(answer: Optional[float], reference: float) -> str:
    """Retourne le commentaire en fonction de l'écart avec la référence."""

    if answer is None or math.isnan(answer):
        return "Outch"

    diff = abs(answer - reference)
    if diff < 1e-6:
        return "Impec"
    if diff <= 0.1:
        return "Presque"
    return "Outch"


def format_float(value: Optional[float], digits: int) -> str:
    if value is None or math.isnan(value):
        return ""
    return f"{value:.{digits}f}"


def power_from_g(g_value: Optional[float], case: CaseReference) -> Optional[float]:
    if g_value is None:
        return None
    return g_value * case.volume_m3 * case.delta_t / 1000.0


def build_corrections(
    header: List[str], rows: List[List[str]]
) -> Tuple[List[str], List[List[str]]]:
    """Construit l'en-tête et les lignes du CSV de correction."""

    try:
        email_index = header.index(EMAIL_COLUMN)
    except ValueError as exc:  # pragma: no cover - dépend du format Framaform
        raise ValueError(f"Colonne '{EMAIL_COLUMN}' introuvable dans l'en-tête") from exc

    question_indices: Dict[str, int] = {}
    for case in CASES:
        try:
            question_indices[case.question] = header.index(case.question)
        except ValueError as exc:
            raise ValueError(
                f"Colonne manquante dans l'export Framaform : '{case.question}'"
            ) from exc

    output_header: List[str] = ["email"]
    for case in CASES:
        output_header.extend(
            [
                f"{case.slug}_reponse_brute",
                f"{case.slug}_g_reponse",
                f"{case.slug}_g_calcule",
                f"{case.slug}_g_retenu",
                f"{case.slug}_phi_reference_kw",
                f"{case.slug}_phi_reponse_kw",
                f"{case.slug}_ecart_kw",
                f"{case.slug}_commentaire",
                f"{case.slug}_lien",
            ]
        )

    output_rows: List[List[str]] = []

    for row in rows:
        if not any(cell.strip() for cell in row):
            continue

        email = row[email_index].strip()
        line: List[str] = [email]

        for case in CASES:
            idx = question_indices[case.question]
            answer_raw = row[idx].strip() if idx < len(row) else ""
            answer_value = extract_g_value(answer_raw)
            phi_reponse = power_from_g(answer_value, case)
            ecart_kw = (
                phi_reponse - case.phi_reference_kw
                if phi_reponse is not None
                else None
            )
            commentaire = comment_for(answer_value, case.g_retenu)

            line.extend(
                [
                    answer_raw,
                    format_float(answer_value, 3),
                    format_float(case.g_calcule, 3),
                    format_float(case.g_retenu, 2),
                    format_float(case.phi_reference_kw, 3),
                    format_float(phi_reponse, 3),
                    format_float(ecart_kw, 3),
                    commentaire,
                    case.search_url,
                ]
            )

        output_rows.append(line)

    return output_header, output_rows


def main(argv: List[str]) -> None:
    if len(argv) < 2 or len(argv) > 3:
        script = Path(argv[0]).name
        print(f"Usage : {script} <export_framaform.csv> [fichier_sortie.csv]", file=sys.stderr)
        sys.exit(1)

    input_path = Path(argv[1])
    if not input_path.exists():
        raise SystemExit(f"Fichier introuvable : {input_path}")

    output_path = Path(argv[2]) if len(argv) == 3 else input_path.with_name(
        input_path.stem + "_corrige.csv"
    )

    header, rows = parse_export(input_path)
    output_header, corrections = build_corrections(header, rows)

    with output_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, delimiter=";")
        writer.writerow(output_header)
        writer.writerows(corrections)

    print(f"Fichier de correction généré : {output_path}")


if __name__ == "__main__":  # pragma: no cover - point d'entrée script
    main(sys.argv)

