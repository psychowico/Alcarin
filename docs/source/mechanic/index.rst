=============
Mechanika gry
=============

Czas
====
Pełen cykl dobowy będzie trwał 24 * 4 = 96 godzin. Czyli dzień będzie trwał dwie nasze doby,
po którym nastąpi noc, trwająca podobnie. Wszelkie wystąpiania słowa "dzień" poniżej odnoszą
się do dnia świata gry.

Zwykli gracze
=============

Zwykły gracz może stworzyć do 3 postaci. Są dwie możliwości powstania postaci:
 - zamieszkanie w ciele 5-letniego dziecka (wymaga istnienia takie dziecka w świecie, prawdopodbnie będzie się wiązała z długim oczekiwaniem)
 - przebudzenie się postaci w wieku 20 lat, w jakiś fabularny sposób, zależnie od rasy

Postacie żyją normalnie około 90 dni, po czym zaczynają się starzeć. W wieku 140 dni są już
zupełnie słabi i podatni na wszelkie słabości, mogą zginąć od zadrapań etc. Gdyby jakaś
postać dożyła 200 dni, od tej granicy codziennie ma 5% szans na naturalną śmierć.
Konsekwencją starzenia jest osłabienie wszelkich zdolności(szczególnie siły fizycznej)
jednak z pamiętanym "najwyższym" poziomem i możliwością uczenia innych według niego.

Substancje
==========

Na początek mały słowniczek:

- *substancja* - dowolny typ obiektu, tak surowiec, jak przedmiot
- *obiekt* - instancja substancji
- *cechy* - zbiór właściwości określający możliwość interakcji obiektu ze światem, jak jego palność, wytrzymałość, czy twardość. Od tego zależy, jak dobrze będzie się palił dany obiekt etc.
- *źródło* - abstrakcyjne pojęcie określające zbiór substancji jakie mogą być pozyskiwane. źródła przypisuje się do określonych obszarów

Substancja (Resource)
---------------------
Stwierdziliśmy, że wszelkie używalne surowce jak i szeroko rozumiane narzędzia będą należeć do tej samej grupy - substancji. Można je uzyskać na jeden z dwóch sposobów: pozyskać ze źródła, lub wyprodukować (prawdopodobnie przy użyciu innych substancji i narzędzi).
*Substancje* charakteryzują się następującymi właściwościami:

- *nazwa (name)* - unikalna nazwa bazowa substancji (np. hammer)
- *etykieta(label)* - tłumaczalny ciąg używany do wygenerowania nazwy substancji w grze, z użyciem jej głównego składnika (np. “{{material}} młotek”)
- *opis(description)* - słowny opis wyglądu i podstawowych właściwości substancji
- *stan skupienia(state of matter)* - stan skupienia materii, jeden z czterech:
- *gazowy(gas)* - przenoszony jedynie w dedykowanych pojemnikach, samoczynnie po prostu rozpływa się w powietrzu
- *ciekły(liquid)* - przenoszony w większości pojemników, samoczynnie rozlewa się i zatraca
- *sypki(powder)* - może leżeć na ziemi w dowolnej ilości, zmienny kształt
- *sztuki(units)* - jako jedyny liczony w sztukach, a nie w pojemnikach (czyli niedoszacowanej objętości, sprawdź dokument “System metryczny”); może leżeć na ziemi i być noszony w pojemnikach, często duża objętość względem masy
- *cechy(properties)* - zbiór właściwości określający możliwość interakcji obiektu ze światem, jak jego palność, wytrzymałość, czy twardość. Od tego zależy, jak dobrze będzie się palił dany obiekt etc. Obiekty pozyskiwane ze źródeł przyjmują wartość tych właściwość zależnie od ustawień źródła. Obiekty tworzone przez postacie zyskują je domyślnie przy pomocy obliczania średniej ważonej substancji użytych przy wytwarzaniu danego obiektu. Jednak kążdą z wartości cech konkretnej substancji można nadpisać własnym wzorem, używającym wszelkich innych cech tej substancji.
- *jakość(quality)*- jakość jest specjalnym typem cechy. Charakteryzuje się tym, że domyślnie nie jest obliczana jedynie przy użyciu średniej ważonej jakości użytych substancji, ale także przy uwzględnieniu staranności pracy, umiejętności rzemieślnika, jakości użytych narzędzi.


Źródła Substancji (Sources)
---------------------------

Jako źródło substancji rozumiemy abstrakcyjny zestaw informacji który może być wykorzystany
do wygenerowania określonych substancji z określonymi cechami(jak jakość, palność),
o określonymi bogactwie etc.

Źródła składają się z listy generowanych substacji (często jednej).
Samo źródła posiada jedynie podstawowe właściwości:

- *etykieta(label)* - domyślny tłumaczalny ciąg używany do wygenerowania nazwy źródła substancji w grze (np. “Las”, “Kopalnie”). Postacie powinny mieć możliwość zapamiętywania własnej nazwy dla każdej instancji źródła
- *opis(description)* - krótki opis fabularny źródła

Każdy z wpisów na liście substancji charakteryzuje się następującymi właściwościami:

- *substancja (resource)* - po prostu wcześniej przygotowany typ substancji
- *bogactwo(richness)* - podana jako sumaryczna dostępna masa tuż po stworzeniu zasobu
- *odnawialność(recovery)* -  z jaką szybkością źródło będzie się odnawiać przy pozostawieniu odłogiem - może być to wzór wykorzystujący inny współczynnik (tak, by po zupełnym wykarczowaniu lasów na danym obszarze praktycznie przestały odrastać, etc. )
- *cechy(properties)* - zakresy cech substancji (także jako wzory) jakie mogą zostać otrzymane z tego źródła

Instancja źródła(source instance) wyróżnia się od typu źródła posiadaniem informacji o stopniu zużycia każdej z generowanych substancji.

System metryczny
================

Mierzenie wszystkich wag w dokładnych wartościach masy - np. w gramach, jak w Cantrze,
jest nienaturalne i powoduje różne głupie sytuacje w grze.
Ogranicza ludziom wyobraźnię dokładnością, uniemożliwia oszukiwanie itp.
Postanowiliśmy, że nasz system powinien charakteryzować sie następującymi cechami:

- brak konieczności używania dokładnej ilości zasobów
- brak stałej, dokładnej jednostki metrycznej (ze strony graczy) - zamiast tego używanie rozmaitych miarek - bazowo “szczypty” i “garści” (potem innych pojemników)
- niedokładność miarek - zależnie od dokładności wykonania ten sam typ kubka może różnić się objętością
- po stronie serwera wszelkie instancje pojemników mają tak określoną pojemność (objętość), jak i określoną ilość masy jaką  mogą pomieścić. w wielu przypadkach będzie to bardzo duża masa i faktyczne znaczenie będzie miała objętość

Szczegóły:

- istnieją dwie typy naturalnych miarek: szczypta i garść
- każda postać ma trochę inną garść/szczyptę
- szczypta to ( 4ml +/- 25%, czyli 3ml-5ml ) stała dla postaci
- garść to ( 100ml +/- 15%, czyli 85ml-115ml ) stała dla postaci

Sposoby mierzenia
-----------------

Osoba będzie widziała zasoby w swoim inwentarzu, czy w otoczeniu poprzez najlepiej
dopasowany pojemnik jaki ma w plecaku (niech to będzie taki, którego po przeliczeniu wychodzi
wielokrotność surowców nabliższa liczbie 10). Jako, że projektów, których nie znamy nie możemy “używać”
i rozumieć, w projektach pokazujemy nazwy tych przedmiotów, jakie faktycznie zostały użyte
w miarkach, które posiadamy. W stanie skupienia liczonym na sztuki (units) nie używamy miarek,
ale po prostu liczby. Jednostki różnią się rozmiarową, znajduje to odzwierciedlenie w ich opisie.
Wszystkie miarki poza szczyptą (występuje tylko w całości) i garścią (pół garści lub cała)
mogą być prezentowane także w przybliżonych częściach: pełny, trzy czwarte, pół, jedna czwarta, pusty.