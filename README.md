# Mi Vida preciosa

Das ist eine kleine mobile Liebes-Seite auf Spanisch.

## Oeffnen

Oeffne `index.html` im Browser.

## Musik

Die Seite versucht beim Oeffnen automatisch Musik zu starten. Viele Handys blockieren Musik mit Ton aber bis zum ersten Tippen. Deshalb startet jeder erste Tipp die Musik nochmal, und die Musik-Taste bleibt als Fallback.

Die Seite nutzt diese lokale Datei:

`assets/rosa-eterna.mp3`

Die MP3 ist bereits unter diesem Namen im Ordner abgelegt. Ohne lokale MP3 oeffnet die Taste den Suno-Link:

https://suno.com/s/R6oedOLFIogGrXNe

## Text anpassen

Die sichtbaren Texte stehen in `index.html`. Die Anrede ist aktuell `Mi Vida preciosa`.

## Bilder

Das Ti-amo-Bild ist als erstes grosses Bild eingebaut. Die anderen Bilder liegen in `assets/photo-*.png` und werden als Erinnerungen, kleine schwebende Foto-Herzen und finale Galerie genutzt. Die schwebenden Herz-Bilder tauschen nach dem Antippen automatisch das Foto.

## Neue Bilder in die Galerie aufnehmen

1. Lade das neue Bild in GitHub in den Ordner `assets` hoch, zum Beispiel als `photo-12-neu.png`.
2. Oeffne `script.js` und ergaenze den Dateinamen in der Liste `photoSources`, zum Beispiel:

```js
"assets/photo-12-neu.png",
```

Danach erscheint das Bild automatisch in der Galerie am Ende und kann auch bei den schwebenden Herz-Bildern auftauchen.
