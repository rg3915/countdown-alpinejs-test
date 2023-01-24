function timer() {
  return {
    expiry: null,
    remaining: null,
    interval: null,
    intervalRemainingTime: null,
    currentTimeGlobal: '',
    currentTime: '',
    currentTimeString: '',
    remainingTimeStr: '',
    initialTime: '',
    initialTimeFull: '',
    finalTimeFull: '',
    started: false,
    oneMinute: 1000 * 60,
    incrementMinutes: 2,
    newTime: {
      minuteInitial: 2,
      minuteFinal: 10,
    },

    init() {
      setInterval(() => {
        // Retorna hora atual constantemente
        this.getCurrentTimeGlobal()
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
      // Retorna a hora atual no formato 'yyyy-mm-dd HH:MM:SS'
      const currentTime = new Date()
      return this.convertTimetoString(currentTime)
    },

    getRemainingTime(endDate) {
      // Converte o tempo em HH:MM:SS
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
      return {
        remainingTime: remainingTime,
        hours: hours,
        minutes: minutes,
      }
    },

    convertTimetoString(currentTime) {
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
      // Calcula hora atual
      // Retorna hora atual constantemente
      this.currentTimeGlobal = this.getCurrentTime().slice(-8)
    },

    getTime() {
      // Pega hora_inicial e hora_final no backend
      this.currentTime = this.getCurrentTime()
      this.currentTimeString = this.getCurrentTime().slice(-8)

      return fetch('http://localhost:3000/hora')
        .then((response) => response.json())
        .then((data) => {
          this.initialTime = data.hora_inicial.slice(-8)
          this.initialTimeFull = data.hora_inicial
          this.finalTimeFull = data.hora_final

          /*
          Se a hora atual for maior ou igual a hora inicial, então
          define started igual a true.
          O started é usado como parâmetro para definir a classe no template.
          */ 
          if (this.currentTime >= this.initialTimeFull) {
            this.started = true
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
      // Calcula o tempo que falta para iniciar o contador.
      Promise.all([this.getTime()])
        .then(() => {
          let endDate = new Date(this.initialTimeFull)

          // Object return multiple values.
          const { remainingTime, hours, minutes} = this.getRemainingTime(endDate)
          this.remainingTimeStr = remainingTime

          if (hours <= -1 && minutes <= -1) {
            this.remainingTimeStr = '00:00:00'
            clearInterval(this.intervalRemainingTime)
          }
        })
    },

    setRemaining() {
      // Atualiza o contador principal.
      if (!this.started) return

      Promise.all([this.getTime()])
        .then(() => {
          let finalTime = new Date(this.finalTimeFull)
          const diff = finalTime - new Date().getTime()

          if (diff <= 1000) {
            document.getElementById('btnRestart').setAttribute('disabled', 'disabled')
            clearInterval(this.interval)
          }

          this.remaining = parseInt(diff / 1000)
        })

    },

    saveNewTimes() {
      let dateString = this.getCurrentTime()
      let dateInitial = new Date(dateString)
      let dateFinal = new Date(dateString)

      // Add 5 minutes to the dateInitial object.
      dateInitial.setMinutes(dateInitial.getMinutes() + this.newTime.minuteInitial)

      // Add 5 minutes to the dateFinal object.
      dateFinal.setMinutes(dateFinal.getMinutes() + this.newTime.minuteFinal)

      // Convert to string.
      newDateInitialString = this.convertTimetoString(dateInitial)
      newDateFinalString = this.convertTimetoString(dateFinal)

      fetch('http://localhost:3000/hora', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hora_inicial: newDateInitialString,
          hora_final: newDateFinalString,
        }),
      })
        .then(location.reload())
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