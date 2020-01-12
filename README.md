# Metronome

## TODO
---
### Table
* How to set a rhythm input table ?
    * What is the table design?
* How to add row / delete row
* How to convert JSON and Table 
    
---
### Other
* How to count loop and show ?
* what kind of sound ?
* How to change values with the keyboard ?
* Strip literals

---

## Doing
* How to select beats ?
* How to design app ?
* How to show MusicMode ?
* Add refresh function

### Issues

---

## Done
* How to save files ? => localStorage
* beats cant be selected when return from musicMode
* How to handle tempo/tick/beats in music.js ? => set directly 
* How to combine "metronome" and "metronome_music" ? =>
    * metronome manages click scheduling
    * music manages musicData

* Organizing closure();
* learn create pure Object => Object.assign({},obj)  or JSON.perse(JSON.stringify(obj))
* decide file format => JSON
* Format data into rhythm object => csvToJSON() in rhythm.js
* change from rhythm =[ [ bar, beats, tempo, [ symbol event, arg1, arg2 ] ],[...],[...] ]
to rhythm =[ { bar: 0, beats: 0, tempo: 0, symbol: { event: "" , arg1: 0, arg2: 0} }, {...},{...} ]
* Make generating rhythm possible
* get rhythm from csv file
* get rhythm from input form as csv
* add Bar control button
* add setRhythm()
* make rhythm array work in metronome_music
* set the rhythm array format to ...
    * rhythm = [ [ 1, a, a, a, a ], [ 2, b, b, b, b ], [ 3, c, c, c, c ], ... ];
    * ~~rhythm = [ [ a, a, a, a ], [ b, b, b, b ], [ c, c, c, c ], ... ];~~
    * ~~rhythm = [ [ a * 4 ], [ b * 3 ], [ c * 2 ], ... ];~~
* add repeat and goto
    * rhythmBuffer = [ [ A ], [ B ], [ C ], ..., [ G ], [ "repeat" , B , 1 ], ... ]; **new!**
    * rhythm = [ [ A ], [ B ], [ C ], ..., [ G ], [ B ], [ C ], ... ];
    * ~~rhythm = [ [ A ], [ B ], [ C ], ..., [ "repeat" ] ];~~
