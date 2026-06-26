module.exports = function seed(db) {
  const insert = db.transaction(() => {

    // ── Filosoof ──
    db.prepare("INSERT INTO philosophers (id, name, years, color, description, sort_order) VALUES (?,?,?,?,?,?)")
      .run("plato", "Plato", "428–348 v.Chr.", "#b5862a",
        "Leerling van Socrates, leraar van Aristoteles. Plato's dialogen vormen het fundament van de westerse filosofie. Via de figuur van Socrates onderzoekt hij de aard van rechtvaardigheid, kennis, schoonheid en de menselijke ziel.", 0);

    // ── Werken ──
    const works = [
      { id: "euthyphro", philosopher_id: "plato", title: "Euthyphro", subtitle: "Wat is vroomheid?", year: "ca. 399 v.Chr.", color: "#8b3a1e", description: "Socrates ontmoet Euthyphro bij de rechtbank — beiden betrokken bij religieuze rechtszaken. Hun gesprek over vroomheid eindigt zonder antwoord, maar stelt een vraag die de westerse filosofie nooit meer heeft losgelaten.", sort_order: 0 },
      { id: "apologie", philosopher_id: "plato", title: "Apologie", subtitle: "De verdedigingsrede van Socrates", year: "ca. 399 v.Chr.", color: "#2a4a6b", description: "Socrates staat terecht voor 501 juryleden. Zijn verdedigingsrede is geen smeekbede — het is een filosofisch manifest.", sort_order: 1 },
      { id: "crito", philosopher_id: "plato", title: "Crito", subtitle: "Moet Socrates vluchten?", year: "ca. 399 v.Chr.", color: "#3d5a3e", description: "Socrates zit in de gevangenis. Zijn vriend Crito smeekt hem te vluchten. Socrates weigert — en legt uit waarom.", sort_order: 2 },
      { id: "phaedo", philosopher_id: "plato", title: "Phaedo", subtitle: "De onsterfelijkheid van de ziel", year: "ca. 399 v.Chr.", color: "#4a3060", description: "Socrates' laatste dag. Vlak voor het gif bespreekt hij met zijn vrienden de onsterfelijkheid van de ziel. Plato was er zelf niet bij — hij was ziek.", sort_order: 3 },
    ];
    works.forEach(w => db.prepare("INSERT INTO works (id, philosopher_id, title, subtitle, year, color, description, sort_order) VALUES (?,?,?,?,?,?,?,?)")
      .run(w.id, w.philosopher_id, w.title, w.subtitle, w.year, w.color, w.description, w.sort_order));

    // ── Fragmenten helper ──
    function addFragment(id, work_id, num, title, annotation, utterances, insights) {
      db.prepare("INSERT INTO fragments (id, work_id, num, title, annotation, sort_order) VALUES (?,?,?,?,?,?)").run(id, work_id, num, title, annotation, num);
      utterances.forEach((u, i) => db.prepare("INSERT INTO utterances (fragment_id, speaker, speech, sort_order) VALUES (?,?,?,?)").run(id, u[0], u[1], i));
      insights.forEach((ins, i) => db.prepare("INSERT INTO insights (fragment_id, label, text, sort_order) VALUES (?,?,?,?)").run(id, ins[0], ins[1], i));
    }

    // ── EUTHYPHRO ──
    addFragment("eu_f1", "euthyphro", 1, "De ontmoeting bij de Koningszaal",
      "Euthyphro en Socrates treffen elkaar bij de rechtbank van de Koning-Archon. Euthyphro is verrast — Socrates staat bekend als iemand die anderen ondervraagt, niet als iemand die zichzelf moet verdedigen. Dit gesprek speelt zich af kort voor het beroemde proces waarbij Socrates ter dood wordt veroordeeld.",
      [["Euthyphro","Why have you left the Lyceum, Socrates? and what are you doing in the Porch of the King Archon? Surely you cannot be concerned in a suit before the King, like myself?"],["Socrates","Not in a suit, Euthyphro; impeachment is the word which the Athenians use."],["Euthyphro","What! I suppose that some one has been prosecuting you, for I cannot believe that you are the prosecutor of another."],["Socrates","Certainly not."]],
      [["Context — De Koning-Archon","De Koning-Archon was één van de negen bestuurders van Athene. Zijn domein omvatte religieuze zaken en aanklachten wegens asebeia (goddeloosheid). In Athene was er geen scheiding tussen religie en staat."]]);

    addFragment("eu_f2", "euthyphro", 2, "De aanklacht",
      "Socrates introduceert zijn aanklager Meletus met een nonchalante fysieke beschrijving — subtiele spot. De twee officiële aanklachten: (1) het corrumperen van de jeugd, en (2) goddeloosheid — het verzinnen van nieuwe goden.",
      [["Socrates","A young man who is little known, Euthyphro; his name is Meletus. He brings a wonderful accusation against me: he says that I am a poet or maker of gods, and that I invent new gods and deny the existence of old ones; this is the ground of his indictment."]],
      [["Context — Het Daimonion","Socrates sprak over een persoonlijk daimonion — een innerlijke stem die hem waarschuwde. Wij zouden dit herkennen als geweten of intuïtie, maar de Atheners hadden dat conceptuele kader nog niet."],["Inzicht — Socratische ironie","Als Socrates zichzelf 'het tegenovergestelde van wijs' noemt, meent hij dat wél — maar in een diepere zin dan Meletus bedoelt. Zijn enige wijsheid is dat hij weet dat hij niets weet."]]);

    addFragment("eu_f3", "euthyphro", 3, "Euthyphro herkent",
      "Euthyphro vergelijkt zichzelf met Socrates: 'wij tweeën worden niet begrepen door de domme massa.' Maar er zit een cruciaal verschil: Socrates is bescheiden over zijn daimonion — het waarschuwt hem alleen. Euthyphro claimt exacte kennis van de wil der goden. Hij twijfelt nooit.",
      [["Euthyphro","I understand, Socrates; he means to attack you about the familiar sign which occasionally comes to you. For when I speak in the assembly about divine things, they laugh at me and think me a madman. Yet every word that I say is true. But they are jealous of us all; and we must be brave and go at them."]],
      [["Inzicht — Geen gelijkgestemden","Socrates gebruikt zijn daimonion als aanleiding tot bescheidenheid en twijfel. Euthyphro gebruikt zijn goddelijke kennis als rechtvaardiging voor absolute zekerheid. Dat verschil wordt de rest van de dialoog steeds belangrijker."]]);

    addFragment("eu_f4", "euthyphro", 4, "Vader aangeklaagd",
      "Euthyphro klaagt zijn eigen vader aan voor moord. Socrates reageert met oprechte verbazing. Een zoon die zijn vader aanklaagt was in Athene maatschappelijk gezien enorm taboe — het ondermijnde niet alleen een persoonlijke relatie, maar de hele structuur van de samenleving.",
      [["Euthyphro","You will think me mad when I tell you."],["Socrates","Why, has the fugitive wings?"],["Euthyphro","Nay, he is not very volatile at his time of life."],["Euthyphro","My father."],["Socrates","Your father! my good man?"]],
      [["Inzicht — Twee soorten plicht","Wat als twee plichten botsen? De plicht je vader te eren én de plicht gerechtigheid te doen? Euthyphro kiest voor gerechtigheid. De meeste Atheners kozen voor familie. Euthyphro probeert vroom te handelen op een manier die iedereen als onvroom beschouwt — dat is de centrale paradox."]]);

    addFragment("eu_f5", "euthyphro", 5, "Wat de vader deed",
      "Een dagloner doodt in dronken woede een huisslaaf. De vader bindt hem vast en stuurt een boodschapper voor religieus advies. Voor de boodschapper terugkeert sterft de man. Heeft de vader hem vermoord? Hij heeft hem niet actief gedood — hij wachtte op goddelijk advies.",
      [["Euthyphro","The man who is dead was a poor dependent who worked as a field labourer on our farm in Naxos, and one day in a fit of drunken passion he got into a quarrel with one of our domestic servants and slew him. My father bound him hand and foot and threw him into a ditch, and then sent to Athens to ask of a diviner what he should do with him. And this is just what happened, for the man died from cold and hunger and his chains before the messenger returned from the diviner."]],
      [["Inzicht — Intentie en morele schuld","De vader wilde de man niet doden — hij legde de beslissing bewust bij de goden. Als de goden bepalen wat goed en fout is, heeft hij het meest vrome gedaan wat hij kon. Dit betekent dat Euthyphro mogelijk de tak afzaagt waarop hij zelf zit."]]);

    addFragment("eu_f6", "euthyphro", 6, "Euthyphro's zekerheid",
      "Socrates stelt een simpele maar vernietigende vraag: ben jij niet bang dat jíj degene bent die onvroom handelt? Euthyphro's antwoord is circulaire redenering: hoe weet jij wat vroom is? Omdat ik Euthyphro ben.",
      [["Socrates","Is your knowledge of religion and of things pious and impious so very exact, that, supposing the circumstances to be as you state them, you are not afraid lest you too may be doing an impious thing in bringing an action against your father?"],["Euthyphro","The best of Euthyphro, and that which distinguishes him, Socrates, from other men, is his exact knowledge of all such matters."]],
      [["Inzicht — De logische val","Socrates zegt hier eigenlijk: om je vader aan te kunnen klagen op grond van vroomheid, moet je met absolute zekerheid weten wat vroomheid is. Euthyphro beantwoordt dit niet — hij verwijst naar zijn eigen reputatie. Dat is geen argument."]]);

    addFragment("eu_f7", "euthyphro", 7, "De Socratische val",
      "De Socratische methode in actie. Socrates doet alsof hij een bescheiden leerling is — maar dit is ironie. Hij nodigt Euthyphro uit vroomheid te definiëren, wetende dat Euthyphro dat niet kan.",
      [["Socrates","And I, my dear friend, knowing this, am desirous of becoming your disciple. Now you, who have so exact a knowledge of piety, teach me what piety is, and then I shall be able to defend myself against Meletus."]],
      [["Inzicht — De elenchus","Socrates speelt de onwetende leerling omdat dat zijn oprechte uitgangspunt is: hij weet dat hij niets weet. Maar die onwetendheid wordt ook een methode. De gesprekspartner wint er geen kennis door — maar wel zelfkennis."]]);

    addFragment("eu_f8", "euthyphro", 8, "Eerste definitie — voorbeeld versus definitie",
      "Euthyphro's eerste definitie is meteen een klassieke denkfout: hij geeft een voorbeeld, geen definitie. 'Vroomheid is wat ík doe.' Als bewijs verwijst hij naar mythologie — maar als goden hun vaders straffen en ruziën, wie bepaalt er dan wat echt vroom is?",
      [["Euthyphro","Holiness is doing as I am doing; that is to say, prosecuting any one who is guilty of murder, sacrilege, or of any similar crime — whether he be your father or mother, or whoever he may be. And please consider: Zeus put his own father Cronos in chains because he wickedly devoured his sons."]],
      [["Inzicht — Voorbeeld vs definitie","Als Socrates vraagt 'wat is rood?' en jij antwoordt 'die appel daar' — dan heb je een voorbeeld gegeven maar niet uitgelegd wat rood ís. Die gemeenschappelijke kern van alle voorbeelden is de definitie."]]);

    addFragment("eu_f9", "euthyphro", 9, "Het Euthyphro-dilemma",
      "De beroemdste vraag van de hele dialoog. Euthyphro past zijn definitie aan — niet 'wat een god liefheeft' maar 'wat alle goden liefhebben.' Dan stelt Socrates het dilemma dat twee onoplosbare opties tegenover elkaar zet.",
      [["Euthyphro","All the gods agree in hating what is unholy and in loving what is holy. And that which all the gods love I define to be holy, and that which they all hate I define to be unholy."],["Socrates","Is the holy loved by the gods because it is holy, or is it holy because it is loved by the gods?"]],
      [["Optie A","Iets is heilig, en dáárom houden de goden ervan. Dan bestaat heiligheid onafhankelijk van de goden — er is een morele orde boven hen."],["Optie B","Iets is heilig omdat de goden ervan houden. Dan scheppen de goden moraliteit. Maar dan is moraliteit willekeurig."],["De grote vraag","Is er een objectieve moraal die onafhankelijk van goden of mensen bestaat? Dit is een vraag die wij nog steeds stellen — 2400 jaar na Plato."]]);

    addFragment("eu_f10", "euthyphro", 10, "Euthyphro's keuze — terug bij het begin",
      "Euthyphro kiest optie A — heiligheid bestaat onafhankelijk van de goden. Maar daarmee ondermijnt hij zijn eigen definitie: 'heilig is wat de goden liefhebben' beschrijft dan alleen de reactie van de goden, niet wat heiligheid zelf is. Ze zijn terug bij het begin.",
      [["Euthyphro","I think, Socrates, that, on this point, the holy is loved by the gods because it is holy — not holy because it is loved."],["Socrates","But then we must begin again and ask, What is the holy? That is an enquiry which I shall never be weary of pursuing."]],
      [["Inzicht — Terug bij het begin","Dit is het patroon van de hele dialoog: elke definitie van Euthyphro blijkt bij nader onderzoek circulair, onvolledig, of tegenstrijdig."]]);

    addFragment("eu_f11", "euthyphro", 11, "Derde definitie — de ruilhandel",
      "Euthyphro's derde definitie: vroomheid is weten hoe je de goden tevreden stelt via gebeden en offers — een ruilhandel. Maar wat winnen almachtige goden bij die ruil? En de definitie draait in een cirkel.",
      [["Euthyphro","Piety is learning how to please the gods in word and deed, by prayers and sacrifices."],["Socrates","I understand then that piety is a kind of art of asking and giving. But if giving to them be a part of piety — what sort of help do we give them?"],["Euthyphro","Obviously, Socrates, we give them honour, and praise, and we please them."],["Socrates","I see, so piety is pleasing to the gods, but not profitable or dear to them?"]],
      [["Inzicht — Wat maakt een definitie goed?","Een definitie moet twee dingen doen: het begrip onderscheiden van alles wat het niet is, én het verbinden met een bredere categorie. Euthyphro's definities falen allemaal omdat ze vroomheid herleiden tot zichzelf."]]);

    addFragment("eu_f12", "euthyphro", 12, "De argumenten lopen weg — Daedalus",
      "Een van de mooiste momenten van de dialoog. Euthyphro geeft toe dat zijn definities weglopen. Socrates maakt een grap over zijn voorvader Daedalus. Euthyphro geeft puntig terug: 'jij bent de Daedalus die ze in beweging zet.'",
      [["Euthyphro","I really do not know, Socrates, how to express what I mean. For somehow or other our arguments seem to turn round and walk away from us."],["Socrates","Your words, Euthyphro, are like the works of my ancestor Daedalus; these notions are your own, you must find some other gist, for they certainly show an inclination to be on the move."],["Euthyphro","Nay, Socrates, I think that the joke is very good. You are the Daedalus who sets arguments in motion; not I, for the arguments would never have moved, but for you."]],
      [["Inzicht — Elegante erkenning","Euthyphro erkent indirect dat Socrates zijn zekerheden tot leven heeft gewekt — en nu lopen ze alle kanten op. Dat is een elegante beschrijving van de elenchus."]]);

    addFragment("eu_f13", "euthyphro", 13, "Euthyphro vertrekt",
      "Euthyphro vertrekt gewoon. De dialoog eindigt niet met een antwoord — hij eindigt met een deur die dichtgaat. Na al die mislukte definities gaat Euthyphro zijn vader aanklagen met dezelfde absolute zekerheid waarmee hij begon.",
      [["Euthyphro","I am in a hurry, and must go now."],["Socrates","What a thing to do, my friend! By going you have cast me down from a great hope which I had — that you would instruct me in the nature of the holy and the unholy."]],
      [["Inzicht — Heeft Euthyphro het begrepen?","Er is een cruciaal verschil tussen niet begrijpen en weigeren te erkennen. Euthyphro stopt juist op het moment dat de cirkel volledig zichtbaar is. Dat is geen onbegrip — dat is vlucht."],["Inzicht — Cognitieve dissonantie","Euthyphro's identiteit rust volledig op zijn claim van goddelijke kennis. Als hij toegeeft dat hij niet weet wat vroomheid is, valt niet alleen zijn aanklacht weg — hij valt weg."]]);

    addFragment("eu_f14", "euthyphro", 14, "Terugblik op de Euthyphro",
      "De Euthyphro eindigt in aporie — bewuste radeloosheid. Niet als falen maar als filosofisch programma. De eerste stap naar wijsheid is erkennen dat je het niet weet.",
      [["Samenvatting","The Euthyphro ends without a definition of piety. Socrates remains charged with impiety. Euthyphro goes to prosecute his father. The question — what is holiness? — is left unanswered."]],
      [["Inzicht — Wat hebben we geleerd?","Het Euthyphro-dilemma is de blijvende erfenis: is iets heilig omdat de goden het liefhebben, of houden de goden ervan omdat het heilig is? Dit dilemma heeft de moraalfilosofie 2400 jaar beziggehouden."],["Inzicht — De diepe menselijke les","Euthyphro is niet dom. Hij is herkenbaar. Hij heeft geïnvesteerd in een overtuiging, zijn identiteit eraan verbonden, en kan er niet meer uit. Dat patroon is tijdloos."],["Inzicht — De les van de Euthyphro","Niet je gelijk krijgen, maar vragen blijven stellen en ruimte voor aporie laten. Absolute zekerheid over het Goede heeft in de geschiedenis vaak geleid tot het tegendeel."]]);

    // ── APOLOGIE ──
    addFragment("ap_f1", "apologie", 1, "Opening — ironie onder druk",
      "Socrates staat voor 501 juryleden die over zijn leven beslissen — en zijn eerste woorden zijn een grap. Zijn toon is precies hetzelfde als in de Euthyphro — kalm, ironisch, zelfverzekerd.",
      [["Socrates","How you have felt, O men of Athens, at hearing the speeches of my accusers, I cannot tell; but I know that their persuasive words almost made me forget who I was — such was the effect of them; and yet they have hardly spoken a word of truth. Unless by the force of eloquence they mean the force of truth; for then I do indeed admit that I am eloquent."]],
      [["Inzicht — Het effect van woorden op zelfbeeld","Socrates erkent openlijk dat de woorden van zijn aanklagers hem even deden wankelen. Een goed verteld verhaal over jou — zelfs een vals verhaal — kan je doen wankelen."]]);

    addFragment("ap_f2", "apologie", 2, "Het orakel van Delphi",
      "Het orakel zei dat niemand wijzer was dan Socrates. Dus ondervroeg hij politici, dichters en ambachtslieden. Keer op keer ontdekte hij: ze dachten wijs te zijn maar waren het niet.",
      [["Socrates","I will tell you why I have such an evil name. When I heard the answer of the oracle, I said to myself: What can the god mean? for I know that I have no wisdom."],["Socrates","I am wiser than this man: it is likely that neither of us knows anything fine and good, but he thinks he knows something when he does not, whereas I, as I do not know anything, do not think I do either."]],
      [["Inzicht — Socrates als vrij mens","Socrates is autonoom — hij handelt vanuit zijn diepste overtuigingen ongeacht sociale gevolgen. Autonomia: jezelf je eigen wet zijn."],["Inzicht — Socrates en Plato's pen","Socrates schreef niets. Is de Socrates die wij kennen de echte Socrates, of deels een creatie van Plato?"]]);

    addFragment("ap_f3", "apologie", 3, "De strafmaat — de Prytaneum",
      "Het meest provocerende moment van de Apologie. In plaats van een straf stelt Socrates een beloning voor: levenslang staatsonderhoud. Dit moment heeft waarschijnlijk tientallen twijfelende juryleden over de streep getrokken naar de doodstraf.",
      [["Socrates","What would be a reward suitable to a poor man who is your benefactor? There can be no reward so fitting as maintenance in the Prytaneum, O men of Athens, a reward which he deserves far more than the citizen who has won the prize at Olympia."]],
      [["Inzicht — Vrijheid versus strategisch gedrag","Socrates kon zichzelf redden door te smeken. Maar dat zou betekenen dat hij deed wat de menigte verwachtte — precies wat hij zijn hele leven had geweigerd."]]);

    addFragment("ap_f4", "apologie", 4, "De minae — een boete als compromis",
      "Na de Prytaneum stelt Socrates dertig minae voor, betaald door zijn vrienden waaronder Plato. Maar het was te laat.",
      [["Socrates","Plato, Crito, Critobulus, and Apollodorus, my friends here, bid me say thirty minae, and they will be the sureties. Let thirty minae be the penalty; for which sum they will be ample security to you."]],
      [["Context — Wat waren dertig minae waard?","Één mina was gelijk aan 100 drachmen, één drachme was ruwweg het dagloon van een geschoolde arbeider. Op basis van dagloon vergelijkbaar met pakweg €450.000 hedendaags."]]);

    addFragment("ap_f5", "apologie", 5, "Het ononderzochte leven",
      "'Het ononderzochte leven is het leven niet waard' — dit is geen slogan. Het is de grond waarop hij sterft.",
      [["Socrates","Men of Athens, I honor and love you; but I shall obey God rather than you, and while I have life and strength I shall never cease from the practice and teaching of philosophy."],["Socrates","The unexamined life is not worth living for a man."]],
      [["Inzicht — De sterkste zin in de westerse filosofie","Deze zin heeft 2400 jaar mensen verontrust. Niet omdat hij troostend is — maar omdat hij vraagt: onderzoek jíj jouw leven?"]]);

    addFragment("ap_f6", "apologie", 6, "Laatste woorden na het doodvonnis",
      "Socrates is zojuist ter dood veroordeeld. Zijn eerste woorden zijn een waarschuwing, geen bitterheid. Dan de allerlaatste zin — een open vraag. De meest Socratische zin die er bestaat.",
      [["Socrates","And now, O men who have condemned me, I prophesy to you: immediately after my death punishment far heavier than you have inflicted on me will surely await you."],["Socrates","The hour of departure has arrived, and we go our ways — I to die, and you to live. Which is better God only knows."]],
      [["Inzicht — Vrijheid, zelfbehoud en overtuiging","Socrates was zeventig, had een vol leven geleefd, en was niet bang voor de dood: waarom zou ik iets vrezen waarvan ik niet weet of het erg is?"],["Inzicht — Socrates en Jezus","Beide zeggen: menselijk lijden komt grotendeels voort uit het projecteren van angst op iets wat nog niet realiteit is. Maar Jezus spreekt vanuit vertrouwen — er is een Vader. Socrates spreekt vanuit onwetendheid."]]);

    addFragment("ap_f7", "apologie", 7, "Terugblik op de Apologie",
      "De Apologie eindigt in een doodvonnis. Toch is Socrates' toon door de hele tekst hetzelfde: kalm, ironisch, zelfverzekerd. Zijn dood was zijn sterkste argument.",
      [["Samenvatting","The Apology ends with Socrates condemned to death. He walks away calmly. The jury disperses. Plato watches. And begins to write."]],
      [["Inzicht — De dood als sterkste argument","Meletus dacht Socrates het zwijgen op te leggen. Maar door hem ter dood te veroordelen maakte hij hem onsterfelijk."],["Inzicht — De lijn naar cognitieve therapie","Socrates doordenkt angst tot ze verdwijnt. De lijn: Socrates → Stoïcijnen → Cognitieve gedragstherapie."]]);

    // ── CRITO ──
    addFragment("cr_f1", "crito", 1, "De gevangenis bij dageraad",
      "De opening is sober en intiem. Geen rechtszaal maar twee oude vrienden in een gevangenis bij het krieken van de dag. En Socrates sliep — rustig, vredig.",
      [["Socrates","Why have you come at this hour, Crito? it must be quite early."],["Crito","The dawn is breaking. I came some time ago but did not awaken you, because I wanted you to be out of pain. I have always thought you happy in the calmness of your temperament; but never did I see the like of the easy, cheerful way in which you bear this calamity."]],
      [["Context — Het heilige schip","Na de Apologie werd Socrates niet meteen geëxecuteerd. Een heilig schip was vertrokken naar Delos — tijdens die afwezigheid mocht niemand worden geëxecuteerd. Socrates zat weken te wachten."],["Inzicht — Vrede versus berusting","Er is een verschil tussen berusting en vrede. Socrates heeft de dood niet weggedacht maar doordacht."]]);

    addFragment("cr_f2", "crito", 2, "Crito's smeekbede en het vaderargument",
      "Crito geeft meerdere argumenten. Het sterkste: je verlaat je kinderen. Socrates kiest voor zijn integriteit boven het welzijn van zijn kinderen. Is dat zelfzucht?",
      [["Crito","O my beloved Socrates, let me entreat you once more to take my advice and escape. And I say that you are deserting your own children; for you might bring them up and educate them; instead of which you go away and leave them."]],
      [["Inzicht — Is Socrates zelfzuchtig?","Een vader die zijn principes verloochent leert zijn kinderen dat principes verloochenbaar zijn als de prijs hoog genoeg is."],["Inzicht — Motivated reasoning","Hoe weet Socrates dat zijn principe voortkomt uit zuiver redeneren en niet uit gehechtheid aan zijn imago? Motivated reasoning: we redeneren vaak naar een conclusie die we al willen bereiken."]]);

    addFragment("cr_f3", "crito", 3, "De Wetten spreken",
      "Socrates laat de Wetten van Athene zelf spreken. Drie argumenten: (1) als jij vlucht ondermijn je het hele rechtssysteem, (2) jij bent wie je bent mede dankzij ons, (3) deugd en staat zijn onscheidbaar.",
      [["De Wetten","Tell us, Socrates, what are you proposing to do? Do you imagine that a State can subsist in which the decisions of law have no power, but are set aside and trampled upon by individuals?"],["De Wetten","Since you were brought into the world and nurtured and educated by us, can you deny that you are our child? Think not of life and children first, and of justice afterwards, but of justice first."]],
      [["Inzicht — Van schuld naar dankbaarheid","Er is een mooier uitgangspunt dan schuld: dankbaarheid. Het ik als kristallisatiepunt van alles wat je hebt ontvangen."],["Inzicht — Het gevaarlijke argument","Gehoorzaam aan de wet ook als ze onrechtvaardig is — dit argument is door de geschiedenis heen gebruikt om mensen te onderdrukken."]]);

    addFragment("cr_f4", "crito", 4, "Burgerlijke ongehoorzaamheid — wanneer gerechtvaardigd?",
      "Het criterium voor handelen is niet consensus maar het doorstaan van de Socratische bevraging. Rosa Parks verschilde van Euthyphro niet in zekerheid maar in de kwaliteit van die zekerheid.",
      [["Context","De Crito laat deze vraag bewust open. Socrates gehoorzaamt een onrechtvaardig vonnis maar heeft zijn hele leven onrechtvaardige conventies bekritiseerd. Is dat consistent?"]],
      [["Inzicht — Teleologisch denken","Bij een rood licht op een verlaten weg kijk je naar het doel van de regel, niet de regel zelf. Hoe hoger de inzet, hoe voorzichtiger met je eigen oordeel."],["Inzicht — Getuigen zonder te winnen","Er is een verschil tussen handelen om te winnen en handelen om te getuigen. Zwijgen is een vorm van instemming."]]);

    addFragment("cr_f5", "crito", 5, "God en de morele orde — het Euthyphro-dilemma opgelost",
      "Als God niet rechtvaardig is maar rechtvaardigheid zelf is — als God onveranderlijk en buiten tijd staat — dan vervalt het Euthyphro-dilemma.",
      [["Context","Is er een objectieve morele orde? En zo ja, wat is haar grond? De vraag leidt terug naar het begin — naar de Euthyphro — maar met een antwoord dat we toen nog niet hadden."]],
      [["Inzicht — De Augustiniaanse oplossing","God is niet extern van rechtvaardigheid — Hij is het concept rechtvaardigheid zelf. Als God onveranderlijk is, is de morele orde ook onveranderlijk."],["Inzicht — Vroomheid als oriëntatie","Socrates was vroom — niet ondanks zijn vragen, maar door zijn vragen. Dat is de definitie die de Euthyphro zocht en niet vond."]]);

    addFragment("cr_f6", "crito", 6, "Het einde — en terugblik op de Crito",
      "De Crito eindigt niet met de Wetten maar met God. De Wetten zijn het instrument, God is de grond. En Crito heeft niets meer te zeggen.",
      [["Socrates","This is the voice which I seem to hear murmuring in my ears, like the sound of the flute in the ears of the mystic; that voice is humming in my ears, and prevents me from hearing any other."],["Crito","I have nothing to say, Socrates."],["Socrates","Leave me then, Crito, to fulfil the will of God, and to follow whither he leads."]],
      [["Inzicht — Geleid worden","'Whither he leads' — waar Hij leidt. Niet waar ik kies te gaan. Zijn dood is geen capitulatie — het is oriëntatie naar het oneindige."],["Inzicht — De drie dialogen als trilogie","Euthyphro, Apologie en Crito vormen een trilogie. De vraag 'wat is vroomheid?' wordt in de Crito impliciet beantwoord."]]);

    // ── PHAEDO ──
    addFragment("ph_f1", "phaedo", 1, "De omlijsting — verhaal binnen verhaal",
      "We bevinden ons niet in Athene maar in Phlius — ver weg, maanden later. Plato was er zelf niet bij — hij was ziek. De dialoog is herinnering, niet aanwezigheid.",
      [["Echecrates","Were you yourself, Phaedo, in the prison with Socrates on the day when he drank the poison?"],["Phaedo","Yes, Echecrates, I was. For to me, too, there is no greater pleasure than to have Socrates brought back into my memory, whether I speak myself or hear another speak of him."]],
      [["Context — Wie was Phaedo?","Phaedo van Elis was als slaaf naar Athene gebracht en werd door Socrates of zijn vrienden vrijgekocht. Iemand die letterlijk bevrijd werd door zijn ontmoeting met Socrates."],["Inzicht — Navertelling en geheugen","Herinneringen zijn geen opnames maar reconstructies. Maar in een actieve gemeenschap die verhalen constant herhaalt worden fouten gecorrigeerd door de gedeelde herinnering."],["Inzicht — De parallel met de evangeliën","Als je de Phaedo in twijfel trekt op basis van navertelling, waarom dan niet de evangeliën? De evangeliën hebben vroegere en talrijkere manuscripten dan vrijwel elke andere antieke tekst."]]);

    addFragment("ph_f2", "phaedo", 2, "De filosoof oefent in sterven",
      "De filosoof oefent zijn hele leven lang in sterven. Filosofie is de oefening van de ziel in onthechting van het lichaam. De dood is voor de filosoof geen verlies maar voltooiing.",
      [["Socrates","The true philosopher is ever seeking to disengage the soul from the communion of the body. And the philosopher desires to escape from the body and to dwell, if possible, in the contemplation of pure existence, released from the alloy of sense."]],
      [["Inzicht — Ascese als methode","Dit argument wordt verder uitgewerkt via drie grote bewijzen: het argument van de tegenstellingen, het argument van de herinnering (anamnesis), en het argument van de gelijkheid aan de Vormen."]]);

    addFragment("ph_f3", "phaedo", 3, "Anamnesis — kennis als herinnering",
      "We leren geen nieuwe dingen; we herinneren ons wat onze ziel vóór de geboorte heeft gekend. Wanneer je twee gelijke stokjes ziet, vergelijk je ze met een idee van volmaakte gelijkheid dat nergens in de wereld bestaat.",
      [["Socrates","From equal sticks we come to know equality. But this knowledge of absolute equality must have been acquired before we were born. Then our souls must have existed before birth."]],
      [["Inzicht — De theorie van de Vormen","De Vormen (eide) zijn eeuwige, onveranderlijke idealen — Schoonheid zelf, Gelijkheid zelf, Rechtvaardigheid zelf — waarvan de dingen in de wereld slechts onvolmaakte kopieën zijn."]]);

    addFragment("ph_f4", "phaedo", 4, "Het drinken van het gif",
      "Na een lang gesprek drinkt Socrates rustig het gif. Hij wast zich — zodat de vrouwen zijn lichaam niet hoeven te wassen. Een kleine, praktische vriendelijkheid op het moment van sterven.",
      [["Phaedo","Such was the end, Echecrates, of our friend; concerning whom I may truly say, that of all the men of his time whom I have known, he was the wisest and justest and best."]],
      [["Inzicht — De slotwoorden","'De wijste, rechtvaardigste en beste man die ik ooit heb gekend.' Phaedo geeft geen filosofisch argument. Hij geeft een getuigenis."]]);

    // ── LEESLIJST ──
    const rl = [
      ["rl1","Filosofie","David Hume","A Treatise of Human Nature","1739","Of Personal Identity","Hume zoekt het zelf en vindt het niet. Het gesprek dat wij hadden over het geconstrueerde ik had bijna letterlijk uit zijn pen kunnen komen.","zelf · identiteit · bewustzijn",1],
      ["rl2","Filosofie","Jean-Paul Sartre","Existentialisme is een humanisme","1945",null,"Existentie gaat vooraf aan essentie — je bent niet geboren met een zelf, je maakt het.","zelf · vrijheid · verantwoordelijkheid",2],
      ["rl3","Filosofie","Derek Parfit","Reasons and Persons","1984","Deel III — Personal Identity","Parfit betoogt dat het zelf minder belangrijk is dan we denken — met verrassende ethische consequenties.","zelf · identiteit · ethiek",3],
      ["rl4","Wetenschap","Antonio Damasio","The Feeling of What Happens","2000",null,"Neurowetenschapper die laat zien hoe het zelfgevoel ontstaat in de hersenen.","zelf · hersenen · bewustzijn",4],
      ["rl5","Wetenschap","Daniel Kahneman","Thinking, Fast and Slow","2011",null,"Over hoe ons denken werkt en hoe weinig het 'ik' de baas is over zijn eigen beslissingen.","zelf · beslissen · psychologie",5],
    ];
    rl.forEach(r => db.prepare("INSERT INTO reading_list (id, category, author, work, year, chapter, why, topic, priority) VALUES (?,?,?,?,?,?,?,?,?)").run(...r));
  });

  insert();
};
