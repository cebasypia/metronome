// Constant definition
import { isPlaying, setIsPlayingTo } from './play.js'
import { isMusicMode } from './music.js'
import { beats, setBeats, refreshBeatsElements } from './beat.js'
import { tempo, setTempo, refreshTempoElements } from './tempo.js'
import { bar, assignmentToBar, setBarElements } from './bar.js'
import { startAnimation } from './canvas.js'

export let metronome
export function newMetronome(gainValue, highTone, lowTone) {
  metronome = new Metronome(gainValue, highTone, lowTone)
}

export class Metronome {
  constructor(rhythm = {}, gainValue = 0.1, highTone = 1500, lowTone = 1200) {
    this.gainValue = gainValue
    this.highTone = highTone
    this.lowTone = lowTone
    this.rhythm = rhythm

    this.clickSchedulerTimerID = 0
    this.beatCountTimeOutIDs = []

    // Web audio api settings
    this.context = new AudioContext()
    this.osc = this.context.createOscillator()
    this.gain = this.context.createGain()

    this.gain.gain.value = 0
    this.osc.connect(this.gain).connect(this.context.destination)
    this.osc.frequency.value = this.highTone
    this.osc.start()
  }

  start() {
    setIsPlayingTo(true)
    // const test = (str) => {
    //   for (let i = bar; i >= 1; i--) {
    //     if (i in this.rhythm && str in this.rhythm[i]) {
    //       return this.rhythm[i][str]
    //     }
    //   }
    // }

    // Define
    // if (isMusicMode) {
    // setTempo(test('tempo'))
    // setBeats(test('beats'))
    // }
    setTempo(this.rhythm[bar].tempo)
    setBeats(this.rhythm[bar].beats)
    let nBeat = 1

    // First note
    this.gain.gain.setValueAtTime(this.gainValue, 0)
    this.gain.gain.linearRampToValueAtTime(0, 0.05)
    startAnimation(tempo, beats.value, nBeat)

    // スケジュール済みのクリックのタイミングを覚えておきます。
    // まだスケジュールしていませんが、次のクリックの起点として現在時刻を記録
    let lastClickTimeStamp = this.context.currentTime * 1000

    // Loop function
    const clickScheduler = () => {
      const now = this.context.currentTime * 1000
      let tick = (1000 * 60) / tempo

      for (
        let nextClickTimeStamp = lastClickTimeStamp + tick;
        nextClickTimeStamp < now + 1000;
        nextClickTimeStamp += tick
      ) {
        if (nextClickTimeStamp - now < 0) {
          continue
        }
        nBeat++
        if (isMusicMode) {
          if (nBeat > beats.value) {
            assignmentToBar(bar + 1)
            nBeat = 1
            // if (bar in this.rhythm) {
            this.rhythm[bar].count++
            // if ('tempo' in this.rhythm[bar]) {
            setTempo(this.rhythm[bar].tempo)
            tick = (1000 * 60) / tempo
            // }
            // if ('beats' in this.rhythm[bar]) {
            setBeats(this.rhythm[bar].beats)
            // }
            if ('jump' in this.rhythm[bar]) {
              console.log(this.rhythm[bar])
              if (this.rhythm[bar].jump.time === this.rhythm[bar].count) {
                assignmentToBar(this.rhythm[bar].jump.to)
              }
            }
            // }
          }
        } else {
          if (nBeat > beats.value) {
            nBeat = 1
          }
        }

        // Fin.
        if (isMusicMode) {
          if (bar >= this.rhythm.bars - 1) {
            clearInterval(this.clickSchedulerTimerID)
            setTimeout(() => {
              this.stop()
            }, nextClickTimeStamp - now)
            return
          }
        }

        // 予約時間をループで使っていたDOMHighResTimeStampからAudioContext向けに変換
        const nextClickTime = nextClickTimeStamp / 1000

        // Hi & Low tone
        if (nBeat === 1) {
          this.osc.frequency.setValueAtTime(this.highTone, nextClickTime)
        } else {
          this.osc.frequency.setValueAtTime(this.lowTone, nextClickTime)
        }

        // Elements update
        const createElementsUpdater = (nBeat, bar, tempo, beats) => {
          return setTimeout(() => {
            if (isPlaying) {
              startAnimation(tempo, beats.value, nBeat)
              if (isMusicMode) {
                refreshTempoElements(tempo)
                setBarElements(bar)
                refreshBeatsElements(beats)
                console.log(`${bar}小節目`)
              }
            }
          }, nextClickTimeStamp - now)
        }
        this.beatCountTimeOutIDs.push(createElementsUpdater(nBeat, bar, tempo, beats))

        // Reserve next click
        this.gain.gain.setValueAtTime(this.gainValue, nextClickTime)
        this.gain.gain.linearRampToValueAtTime(0, nextClickTime + 0.05)

        // Update lastClickTimeStamp
        lastClickTimeStamp = nextClickTimeStamp
      }
    }
    // Loop start
    clickScheduler()
    this.clickSchedulerTimerID = setInterval(clickScheduler, 700)
  }

  stop() {
    setIsPlayingTo(false)

    this.context.close()

    // Cancel reservation
    clearInterval(this.clickSchedulerTimerID)

    this.beatCountTimeOutIDs.forEach((timeOutID) => {
      clearTimeout(timeOutID)
    })
  }
}
