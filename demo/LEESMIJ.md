# Twijgje — lokale demonstratie

Download `twijgje.html` en open het bestand in Microsoft Edge of Google Chrome op een laptop. Er is geen installatie, internetverbinding of Microsoft 365-aanmelding nodig. Het bestand bevat de volledige demo, zonder externe scripts of lettertypen. Gebruik uitsluitend fictieve gegevens.

## Dagregistratie en facturen uitproberen

1. Start met **27 juli 2026**. Kies **Voormiddag** of **Namiddag**: alleen de verwachte cliënten van dat dagdeel staan in de lijst. Een onverwachte bezoeker kun je toevoegen; bevestig daarna de werkelijke aanwezigheid. Toevoegen zelf veroorzaakt geen kosten.
2. Vul **aantallen** in voor middagmaal, soep en Zoete Inval (0–99). Bijvoorbeeld 2 maaltijden wordt op de factuur 2 × de eenheidsprijs. De kosten zijn per cliënt per dag: wisselen van dagdeel telt consumpties niet dubbel.
3. Vul eventueel een **vrij bedrag en omschrijving** in, bijvoorbeeld ‘Winkeltje en uitstap’. Dit is één vrij bedrag per cliënt per dag, met maximaal twee decimalen. Een ontbrekende omschrijving blokkeert het afdrukken. Het bedrag is rechtstreeks het aan te rekenen bedrag; er wordt geen tarief op toegepast.
4. Stel onder **Instellingen** de testtarieven in, met ingangsdatum. De bevestigde tarieven zijn **€5 per middagmaal** en **€1,50 per soep**. €4 per dagdeel blijft een voorbeeld. Het tarief voor Zoete Inval moet nog ingevuld worden. Leeg is niet gratis: vul expliciet 0 in voor een gratis prestatie.
5. Open **Maandafrekening**, kies juli 2026 en een cliënt of **PVT Voorbeeldhuis**. De factuur toont aantallen, eenheidsprijzen en regelbedragen. PVT is **niet betalend**. Het PVT-overzicht bevat alleen aanwezigheidsregels van €0; consumpties en vrije bedragen veroorzaken voor PVT evenmin kosten. De dagdeeltelling voor de detachering van Leen staat onder Overzichten.
6. Gebruik **Afdrukken / opslaan als PDF** en kies in het afdrukvenster voor opslaan als PDF. Het resultaat blijft een duidelijk gemarkeerd concept, zonder betaalverzoek.

Verlof wordt niet aangerekend. Bij een volledige verlofdag worden alle aantallen, het vrije bedrag en de omschrijving verwijderd. Een halve dag verlof sluit consumpties niet uit. Voor niet-geplande dagdelen hoef je geen afwezigheid in te vullen. Eerder vastgelegde ongeplande aanwezigheden blijven zichtbaar.

Ontbrekende tarieven, ontbrekende omschrijvingen en onbekende verwachte dagdelen blokkeren de afdrukknop. Een dag die al registraties heeft wordt gecontroleerd op ontbrekende verwachte cliënten; dagen zonder enige registratie worden niet automatisch aangemaakt. Dit is geen bevestigde volledige maandafsluiting.

## E-mail voorbereiden

Bij **Maandafrekening** kun je per factuurontvanger een fictieve contactpersoon en e-mailadres bewaren: bijvoorbeeld een bewindvoerder, de cliënt zelf of de PVT-instelling. Die contactgegevens zijn alleen lokaal bewaard.

**E-mailtekst voorbereiden** maakt een concepttekst. De optionele link **Open concept in je mailprogramma** opent een `mailto`-concept; dit vereist een lokaal ingesteld mailprogramma. De PDF wordt niet automatisch toegevoegd: voeg die zelf toe. De demo verstuurt niets en bevat geen automatische Microsoft 365-verzending.

Rechtstreekse verzending met PDF-bijlage, een afzender vanuit de organisatie en een verzendlog vereist een latere Microsoft 365-integratie met passende toegang, rechten en licentiecontrole. Gebruik de demo niet om echte facturen te versturen.

## Jaaroverzicht en PVT-aanwezigheden

Onder **Overzichten**:

- Kies een jaar voor nieuwe inschrijvingen, uitschrijvingen, gekend actieve cliënten op 31 december en ingevoerde aanwezigheden. De inschrijfdatum bepaalt ‘nieuw’, niet het eerste bezoek.
- Onder **Instellingen → In- en uitschrijfdata** kun je de fictieve data aanpassen. Een uitschrijfdatum is de eerste dag waarop de cliënt niet meer actief is en niet meer automatisch verwacht wordt. Historische registraties worden bewaard.
- Ontbrekende inschrijfdata worden gemeld en tellen niet als bekende nieuwe of actieve cliënten. De demo bewaart één inschrijfperiode per cliënt; herinschrijvingen zijn nog niet uitgewerkt.
- Het **PVT-overzicht** kan per jaar of per maand worden bekeken. Het toont per cliënt de aanwezige dagen, dagdelen, volledige dagequivalenten en de datums.
- Eén aanwezige voormiddag is één aanwezige datum en een half dagequivalent. Een voor- én namiddag op dezelfde datum is één aanwezige datum en één volledig dagequivalent. Sommen over cliënten zijn cliëntdagen, geen unieke openingsdagen.
- **Downloaden (CSV)** bewaart het overzicht als apart bestand, te openen in Excel. Aanwezigheden worden alleen uit de ingevoerde registraties geteld: een export bewijst niet dat de volledige periode geregistreerd is.

## Cliënten en afdrukken

Via **Cliënten** kun je fictieve cliënten inschrijven en hun naam, adres, telefoon, e-mailadres, inschrijfdatum, uitschrijfdatum, basisplanning en facturatiecontact/bewindvoerder bewaren. Een cliënt krijgt automatisch een uniek nummer. Gebruik **Bewerken** om de gegevens aan te passen; uitschrijven bewaart de historie.

Het vakje **PVT — niet betalend, altijd €0** bepaalt of de cliënt vrijgesteld is. Aanvinken herberekent alle concepten voor die cliënt naar €0, zonder aanwezigheden te verwijderen. Het PVT-overzicht is geen betalingsverzoek. Bij uitschrijven telt de cliënt vanaf die datum niet meer als verwacht.

De cliëntenlijst heeft een peildatum en filters voor **ingeschreven**, **aanwezig** of **alle cliënten**. ‘Aanwezig’ betekent minstens één dagdeel als aanwezig geregistreerd op de peildatum; dit is geen realtime detectie. De zoekfilter op naam/nummer geldt ook voor de afdruk. **Deze cliëntenlijst afdrukken** bevat nummer, naam, PVT en status, zonder contactgegevens.

Bij **Daglijst → Blanco dagblad afdrukken** wordt voor de geselecteerde datum een volledig dagblad gemaakt met de verwachte voor- en namiddaggasten, eventuele reeds toegevoegde bezoekers, planning VM/NM, lege kolommen voor daadwerkelijke aanwezigheid, aantallen en een vrij bedrag. Ook zijn er extra lege regels en opmerkingenruimte. De bestaande registraties worden niet in de handmatige invulvakken afgedrukt en worden niet gewijzigd door het afdrukken. Kies in het afdrukvenster een printer of opslaan als PDF. Test dit eerst met fictieve gegevens en bewaar echte papieren lijsten later volgens het beleid van de organisatie.

## Login en rollen

Er is **geen beveiligde login in deze lokale demo**. De gevraagde Microsoft 365-aanmelding, uitsluitend facturatietoegang voor zowel boekhouding Welzijnszorg Kempen als Bart zijn beschreven in [het toegangsontwerp](../docs/TOEGANG.md). Daarin staan ook de concrete voorwaarden voor uitvoering en verificatie. Een wachtwoordscherm of verborgen tabblad in een los HTML-bestand beschermt de opgeslagen gegevens niet. Er worden dus geen accounts of wachtwoorden in de demo nagebootst.

## Bestaande demogegevens

De nieuwe versie gebruikt dezelfde browseropslagsleutel als de vorige demo. Als bestaande opslag op dezelfde bestandslocatie en in dezelfde browser beschikbaar is, worden oude vinkjes omgezet naar aantallen 0 of 1. Registraties en extra verwachte bezoeken blijven bewaard. De oude tarieven voor **middagmaal en soep worden bij de upgrade vervangen door €5 en €1,50**, ook voor bestaande concepten. Overige tarieven blijven bewaard. De gecorrigeerde PVT-regel geldt onmiddellijk: PVT-concepten worden €0. Er is nog geen onveranderlijk definitief factuurarchief.

Inschrijfdata uit de eerste demo waren niet bekend en worden niet verzonnen; vul ze zelf aan. Nieuw toegevoegde contactvelden beginnen leeg. Een herstelkopie van de oude opslag wordt, wanneer de browser het toelaat, onder een aparte lokale sleutel bewaard.

De oude categorie ‘Andere’ blijft voor bestaande registraties als **Andere (oude demo)** zichtbaar en wordt bij betalende cliënten aangerekend met het oude tarief. Ze wordt niet stilzwijgend veranderd in Zoete Inval. Gebruik voor nieuwe gegevens Zoete Inval of het vrije bedrag. Tarief **Andere, oude demo** is alleen voor deze compatibiliteit.

## Grenzen van deze demo

- Wijzigingen blijven alleen in de lokale browseropslag. Dit kan per browser en bestandslocatie verschillen; het is geen betrouwbare administratie of reservekopie. Gebruik de CSV-downloads om overzichten afzonderlijk te bewaren. Een CSV kan niet als volledige databack-up worden geïmporteerd.
- Er is geen gedeelde database, Teams-koppeling, aanmelding of autorisatie. Geen echte cliëntgegevens invoeren.
- De vijf startcliënten en instelling zijn fictieve voorbeelden; nieuwe fictieve cliënten kunnen worden toegevoegd. De basisplanning herhaalt zich elke datum binnen de inschrijfperiode; aanvullingen zijn datumgebonden. Weekschema's, herinschrijvingen en een productieklare contact- en rechtenadministratie volgen later.
- Facturen zijn concepten. Er is geen definitieve nummering, onveranderlijk factuurarchief, verzending of betalingsverwerking. Tariefwijzigingen herberekenen concepten. Afzender, rekening en btw-regels zijn nog niet ingericht. Een cliëntadres kan al lokaal worden bewaard.
- Gebruik voor productie vereist een afzonderlijke implementatie en test in Microsoft 365, inclusief tenanttoegang, gedeelde opslag, gegevensbeveiliging, licenties en factuurinstellingen.

## Ontwikkelen en controleren

Vanuit de repository: `npm test` (Node.js, geen pakketten nodig). Dit controleert berekeningen, planning, aantallen en bedragen, verlof, datummarges, jaar- en PVT-tellingen, PVT-vrijstelling, cliëntregistratie, migratie en CSV-opmaak.

Optioneel: `python3 tests/browser_smoke.py`, met Python Playwright en Chromium geïnstalleerd. Via `CHROMIUM_BIN` kan een ander browserpad worden gekozen. De test start een tijdelijke lokale server, controleert bediening, cliëntenbeheer, downloads en afzonderlijke afdrukken en gebruikt alleen geïsoleerde fictieve browseropslag. De PDF en schermafbeeldingen worden in de tijdelijke map geschreven.

Voor handmatige browsercontrole: `python3 -m http.server 8000 --bind 127.0.0.1 --directory demo`. Dit is alleen een lokale ontwikkelserver. Er is geen server nodig om het gedownloade HTML-bestand op Windows te openen.
