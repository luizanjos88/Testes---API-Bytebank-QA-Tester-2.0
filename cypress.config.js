const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      on('task', {
        gerarUsuariosFixture() {
          const fs = require('fs');

          // 1. Ler db.json atual
          const dbPath = 'db.json';
          const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

          // 2. Extrair os usuários (filtrando quem não tem e-mail)
          const usuarios = db.users.filter(user => user.email && user.email !== "");

          // 3. Salvar na fixture para o teste
          fs.writeFileSync('cypress/fixtures/usuarios.json', JSON.stringify(usuarios, null, 2));
          
          return null;
        },
      });
    },
  },
  env: {
    mobileViewportWidthBreakpoint: 420,
  },
  viewportWidth: 1200,
  viewportHeight: 990,
});
