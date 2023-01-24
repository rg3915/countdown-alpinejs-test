function timer(expiry) {
  return {
    expiry: expiry,
    remaining: null,
    intervalTest: null,
    interval: null,
    intervalRemainingTime: null,
    currentTimeGlobal: '',
    currentTime: '',
    currentTimeString: '',
    remainingTimeStr: '',
    initialTime: '',
    initialTimeFull: '',
    started: false,
    oneMinute: 1000 * 60,
    incrementMinutes: 2,

    init() {
      setInterval(() => {
        this.getCurrentTimeGlobal()
      }, 1000)

      this.intervalTest = setInterval(() => {
        this.getTime()
      }, 1000)

      this.setRemaining()
      this.interval = setInterval(() => {
        this.setRemaining()
      }, 1000)

      this.intervalRemainingTime = setInterval(() => {
        this.remainingTime()
      }, 1000)

    },

    restartTime() {
      fetch('http://localhost:3000/tempo_total')
        .then((response) => response.json())
        .then((data) => {
          const currentTime = this.expiry - new Date().getTime()

          if (currentTime <= this.oneMinute * this.incrementMinutes) {
            const minutes = data.minutos * this.oneMinute
            const seconds = data.segundos * 1000
            this.expiry = new Date().getTime() + minutes + seconds + 1000
          }

        })
    },

    getCurrentTime() {
      const currentTime = new Date()
      const currentTimeStr = currentTime.getFullYear() + '-' + 
          ('0' + (currentTime.getMonth()+1)).slice(-2) + '-' + 
          ('0' + currentTime.getDate()).slice(-2) + ' ' + 
          ('0' + currentTime.getHours()).slice(-2) + ':' + 
          ('0' + currentTime.getMinutes()).slice(-2) + ':' + 
          ('0' + currentTime.getSeconds()).slice(-2)
      // console.log(currentTimeStr) // 'yyyy-mm-dd HH:MM:SS'
      return currentTimeStr
    },

    getCurrentTimeGlobal() {
      this.currentTimeGlobal = this.getCurrentTime().slice(-8)
    },

    getTime() {
      this.currentTime = this.getCurrentTime()
      this.currentTimeString = this.getCurrentTime().slice(-8)

      return fetch('http://localhost:3000/hora')
        .then((response) => response.json())
        .then((data) => {
          this.initialTime = data.hora_inicial.slice(-8)
          this.initialTimeFull = data.hora_inicial
          if (this.currentTime >= this.initialTimeFull) {
            this.started = true
            clearInterval(this.intervalTest)
            console.log('maior')
          } else {
            console.log('menor')
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },

    remainingTime() {
      Promise.all([this.getTime()])
        .then(() => {
          let endDate = new Date(this.initialTimeFull)

          let currentDate = new Date()
          let diff = endDate - currentDate

          let days = Math.floor(diff / (1000 * 60 * 60 * 24))
          let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          let seconds = Math.floor((diff % (1000 * 60)) / 1000) + 1

          let hoursStr = hours < 10 ? `0${hours}` : hours
          let minutesStr = minutes < 10 ? `0${minutes}` : minutes
          let secondsStr = seconds < 10 ? `0${seconds}` : seconds

          let remainingTime = hoursStr + ':' + minutesStr + ':' + secondsStr
          this.remainingTimeStr = remainingTime

          if (hours <= -1 && minutes <= -1) {
            this.remainingTimeStr = '00:00:00'
            clearInterval(this.intervalRemainingTime)
          }
        })
    },

    setRemaining() {
      if (!this.started) return

      const diff = this.expiry - new Date().getTime()

      if (diff <= 1000) {
        document.getElementById('btnRestart').setAttribute('disabled', 'disabled')
        clearInterval(this.interval)
      }

      this.remaining = parseInt(diff / 1000)
    },

    minutes() {
      return {
        value: Math.floor(this.remaining / 60),
        remaining: this.remaining % 60
      }
    },

    seconds() {
      return {
        value: this.minutes().remaining,
      }
    },

    format(value) {
      return ('0' + parseInt(value)).slice(-2)
    },

    time() {
      return {
        minutes: this.format(this.minutes().value),
        seconds: this.format(this.seconds().value),
      }
    },
  }
}