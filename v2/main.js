function timer(expiry) {
  return {
    expiry: expiry,
    remaining: null,
    interval: null,
    oneMinute: 1000 * 60,
    incrementMinutes: 2,

    init() {
      this.setRemaining()
      this.interval = setInterval(() => {
        this.setRemaining();
      }, 1000);
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

    setRemaining() {
      const diff = this.expiry - new Date().getTime();

      if (diff <= 1000) {
        document.getElementById("btnRestart").setAttribute("disabled", "disabled");
        clearInterval(this.interval)
      }

      this.remaining = parseInt(diff / 1000);
    },

    minutes() {
      return {
        value: Math.floor(this.remaining / 60),
        remaining: this.remaining % 60
      };
    },

    seconds() {
      return {
        value: this.minutes().remaining,
      };
    },

    format(value) {
      return ("0" + parseInt(value)).slice(-2)
    },

    time() {
      return {
        minutes: this.format(this.minutes().value),
        seconds: this.format(this.seconds().value),
      }
    },
  }
}