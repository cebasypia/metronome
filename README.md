# metronome
## Web Application Metronome 
----
### TODO
* Make generating rhythm possible
* set a rhythm input form
    * decide the design of the rhythm input form 
    * get data from input form
    * Format data into rhythm array
* Organizing closure();
* combine "metronome" and "metronome_music"
* Value change with keyboard
---
### DONE
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
