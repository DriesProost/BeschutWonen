# Twijgje — lokale demonstratie

Open `twijgje.html` in Microsoft Edge of Google Chrome op een laptop. Er is geen installatie, internetverbinding of Microsoft 365-aanmelding nodig. Het bestand bevat de volledige demo, zonder externe scripts of lettertypen.

## Uitproberen

1. Start met de voorbeeldregistraties van **27 juli 2026**.
2. Kies **Voormiddag** of **Namiddag**. Alleen de verwachte cliënten van dat dagdeel staan in de lijst. Wijzig hun aanwezigheid of maaltijd. Alleen fictieve gegevens gebruiken.
3. Stel onder **Instellingen** testtarieven in voor soep en andere prestaties. De ingevulde €4 voor dagdelen en maaltijden is ook een voorbeeld.
4. Open **Maandafrekening**, kies juli 2026 en een cliënt of **PVT Voorbeeldhuis**.
5. Gebruik **Afdrukken / opslaan als PDF** en kies in het afdrukvenster voor opslaan als PDF. Het resultaat blijft een duidelijk gemarkeerd concept, zonder betaalverzoek.

De PVT krijgt één concept met details en subtotalen per cliënt. Verlof wordt niet aangerekend. Bij een volledige verlofdag worden aangevinkte consumpties verwijderd. Ontbrekende tarieven en onbekende dagdelen binnen de ingevoerde registraties blokkeren de afdrukknop. Dagen zonder registratie worden niet automatisch aangemaakt of als een volledige gecontroleerde maand beschouwd.

Voor niet-geplande dagdelen hoef je geen afwezigheid in te vullen. Een onverwachte bezoeker kun je voor de gekozen datum en het gekozen dagdeel toevoegen met **Toevoegen aan dit dagdeel**. Bevestig daarna de aanwezigheid; toevoegen veroorzaakt zelf geen kosten. Eerder vastgelegde ongeplande aanwezigheden blijven zichtbaar. Maaltijden, soep en andere prestaties worden per cliënt per dag bewaard, dus wisselen van dagdeel telt ze niet dubbel.

## Grenzen van deze demo

- Wijzigingen blijven alleen in de lokale browseropslag. Dit kan per browser en bestandslocatie verschillen; het is geen betrouwbare administratie of reservekopie.
- Er is geen gedeelde database, Teams-koppeling, aanmelding of autorisatie. Gebruik geen echte cliëntgegevens.
- Cliënten, instelling en basisplanning zijn vaste fictieve voorbeelden. De basisplanning herhaalt zich in deze demo elke datum; aanvullingen zijn datumgebonden. Er is nog geen weekschemabeheer, cliëntbeheer of verlofrechtenadministratie.
- ‘Andere’ is voorlopig één extra prestatie per cliënt per dag. Verdere invulling volgt na afstemming.
- Facturen zijn concepten. Er is geen definitieve nummering, onveranderlijk factuurarchief, verzending of betalingsverwerking. Bewaarde tariefwijzigingen herberekenen concepten.
- Gebruik voor productie vereist een aparte implementatie en test in Microsoft 365, inclusief toegang en controle van licenties, gegevensbeveiliging en factuurinstellingen.

## Ontwikkelen en controleren

Vanuit `/workspace/BeschutWonen`: `npm test` (Node.js, geen pakketten nodig).

Open voor een lokale HTTP-controle eventueel `python3 -m http.server 8000 --bind 127.0.0.1 --directory demo`. Dit is alleen een lokale ontwikkelserver. Er is geen server nodig om het gedownloade HTML-bestand op Windows te openen.
