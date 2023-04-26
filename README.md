# Testy-aplikacji-ADF-Hydra

1. 1-Testy-manualne-ADF-Hydra-plan-testów-TestLink

  W tym folderze znajdują się testy manualne, plan testów oraz wykonane przypadki testowe aplikacji ADF-Hydra. Raporty te zostały stworzone w programie TestLink i wygenerowane w formacie PDF.
  
2. 2-Testy-automatyczne-Selenium-ADF-Hydra

  Folder zawiera testy automatyczne napisane dla aplikacji ADF-Hydra w języku JavaScript przy użyciu Selenium oraz raport z wynikami tych testów.
  
  Uruchomienie testów automatycznych:
  - aby uruchomić testy automatyczne należy pobrać aplikację ADF-Hydra, otworzyć ją i uruchomić, wpisując w terminalu:
  node app.js
  - aplikacja uruchamia się na:
  localhost:3000
  - następnie w nowym oknie otworzyć testy automatyczne umieszczone w tym folderze i w terminalu wpisać:
  npx mocha --no-timeouts 'test/automaticTestsAdf-Hydra.js'
  - aby testy uruchomiły się poprawnie należy wcześniej pobrać i zainstalować chromedriver na swoim komputerze
  
  Otwarcie raporu z wynikami testów:
  - należy pobrać raport, a następnie kliknąć dwa razy na plik: mochawesome.html
  - uruchomi się przeglądarka z wynikami testów
  
3. 3-Testy-wydajnosciowe-Jmeter-ADF-Hydra

  Znajdują się tutaj testy wydajnościowe stworzone w programie Jmeter i zapisane w pliku pod nazwą: ADF-Hydra-Test.jmx, jak i raporty z testów dla opowiednio 1, 20 i 50 samplesów.
  
  Uruchomienie testów wydajnościowych:
  - aby uruchomić te testy należy również w pierwszej kolejności pobrać i uruchomić aplikację ADF-Hydra, wpisując w terminalu otwartej aplikacji polecenie:
  node app.js,
  - aplikacja uruchamia się na:
  localhost:3000,
  - następnie uruchomić testy w Jmeter
  
  Otwarcie raporów z wynikami testów:
  - należy pobrać raporty, a następnie kliknąć dwa razy na plik: index.html
  - uruchomi się przeglądarka z wynikami testów
