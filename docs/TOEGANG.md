# Beveiligde toegang voor de productieversie

Status: ontwerp, niet ingericht. De lokale HTML-demo heeft geen aanmelding of toegangsbeperking en is uitsluitend bedoeld voor fictieve gegevens. Er is geen Microsoft 365-tenant, appregistratie, geautoriseerde backend of gebruikersgroep voor dit project verbonden met deze sessie.

## Gevraagde gebruikers

- Boekhouding Welzijnszorg Kempen: uitsluitend facturatie, de daarvoor benodigde contactgegevens en eventuele exports. Geen algemene toegang tot de dagregistratie of overige cliëntcontactgegevens.
- Bart: toegang nog te bevestigen (beheer van alle onderdelen of alleen facturen).
- Dagwerking: aanwezigheid en noodzakelijke cliëntregistratie; factuurbeheer alleen als expliciet toegekend.
- Beheer: gebruikers en bevoegdheden beheren, tarieven en instellingen aanpassen.

De precieze gebruikersaccounts, toestemming voor eventuele externe toegang en de rechten van Bart moeten bij implementatie worden bevestigd. Geen gedeelde wachtwoorden. De namen van de organisatie en personen zijn hier rolvereisten, geen aangemaakte accounts.

## Voorstel voor Microsoft 365

Aanmelden met Microsoft Entra ID via de bestaande Microsoft 365-accounts. Voor externe boekhoudmedewerkers kan gasttoegang nodig zijn, afhankelijk van hun tenant en het beleid van de organisatie. Daarvoor moet de Microsoft 365-beheerder de toegestane route bevestigen.

Autorisatie moet bij de gegevensbron of backend worden afgedwongen. Tabbladen verbergen in Power Apps of JavaScript, een rolkeuzescherm of een wachtwoord in het HTML-bestand biedt geen privacybescherming. Wanneer SharePoint wordt gebruikt, moeten de rechten op sites/lijsten en de scheiding tussen dagelijkse werking en facturatie overeenkomen met deze rollen. Een lijstweergave of appfilter is geen toegangsbeperking. Betalende cliënten, PVT-status en facturatiecontacten mogen alleen door bevoegde gebruikers worden gewijzigd.

## Concrete voorwaarden voor uitvoering

1. Een beheerder bevestigt de testtenant, gebruikers/gasten, groepen en de gewenste rollen, inclusief Bart.
2. De beheerder maakt de benodigde testsite en appomgeving beschikbaar of verleent de noodzakelijke gedelegeerde rechten aan de implementator. Geen wachtwoorden of toegangssleutels in chat.
3. Gegevens worden naar een beveiligde gedeelde opslag overgebracht. Toegang tot factuurgegevens en bronregistraties wordt afzonderlijk ingericht en gecontroleerd.
4. De app wordt in de tenant geregistreerd/geconfigureerd met minimale rechten. Eventuele extra Power Apps/Power Automate-licenties worden gecontroleerd vóór ingebruikname.
5. Test met afzonderlijke accounts: een boekhoudaccount moet geweigerde gegevens ook via rechtstreekse gegevensbronverzoeken niet kunnen lezen of wijzigen. Test eveneens niet-aangemelde toegang, rolwijziging, gasttoegang en sessieafmelding.
6. E-mailverzending gebeurt pas daarna vanuit een toegelaten organisatiepostvak, met PDF-bijlage en verzendregistratie. De demo opent uitsluitend een lokaal mailconcept.

Er is in deze sessie geen echte aanmelding of autorisatie geïmplementeerd of gevalideerd. De demo toont dit expliciet en verzamelt geen wachtwoorden.
