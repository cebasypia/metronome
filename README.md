# metronome

## TODO
---
### RHYTHM
* How to set a rhythm input table ?
    * What is the table design?
    
---
### OTHER
* How to count loop and show ?
* what kind of sound ?
* How to combine "metronome" and "metronome_music" ?
* How to change values with the keyboard ?

---

## DOING
* How to handle tempo/tick/beats in music.js ?
* How to select beats ?
* How to design app ?

---

## DONE
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
