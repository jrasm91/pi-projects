var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    links: [
      { title: 'Pool' },
    ],
    pool_temperature: 'Loading...',
  },
  methods: {
    refreshPoolTemp: async function () {
      try {
        app.pool_temperature = 'Loading...';
        const { temperature, date } = await fetch('/api/pool/temperature').then(response => response.json());
        console.log(`Loaded temperature=${temperature}, date=${date}`);
        app.pool_temperature = temperature;
      } catch (error) {
        console.log(error);
      }
    }
  }
});

app.refreshPoolTemp();
