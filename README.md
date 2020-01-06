# metronome

## TODO
---
### RHYTHM
* set a rhythm input table
    * decide the design of the table
    * Format data into rhythm object
* decide file format
---
### OTHER
* learn create pure Object
* count loop and show
* design sound
* Organizing closure();
* combine "metronome" and "metronome_music"
* Value change with keyboard
---
## DONE
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
