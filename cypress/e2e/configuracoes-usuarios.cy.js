import { faker } from '@faker-js/faker/locale/pt_BR';

describe('Atualização de dados do usuario', () => {
  const novoDadosDeUsuario = {
    nome: faker.name.fullName(),
    senha: faker.internet.password(),

  };

  beforeEach(() => {
    cy.task('gerarUsuariosFixture');
  });

  it('Deve permitir o usuário atualizar seus dados', () => {

    cy.fixture('usuarios').then((usuarios) => {
      cy.login(usuarios[14].email, usuarios[14].senha);

      cy.visit('/home');
      cy.url().should('include', '/home');

      cy.contains(usuarios[14].nome).should('be.visible');
      cy.getByData('app-home').find('a').eq(1).click();

      cy.url().should('include', '/minha-conta');

      cy.getByData('botao-salvar-alteracoes').should('be.disabled');

      cy.get('[name = "nome"]').type(novoDadosDeUsuario.nome);
      cy.get('[name = "senha"]').type(novoDadosDeUsuario.senha);

      cy.getByData('botao-salvar-alteracoes').should('not.be.disabled');
      cy.getByData('botao-salvar-alteracoes').click();

      cy.on('window:alert', (textoDoAlert) => {
        expect(textoDoAlert).to.equal('Alterações salvas com sucesso!');
      });

      cy.url().should('include', '/home');

      cy.window().then((win) => {
        expect(win.localStorage.getItem('nomeUsuario')).to.equal(
          novoDadosDeUsuario.nome
        );

        const userId = win.localStorage.getItem('userId');

        cy.request('GET', `http://localhost:8080/users/${userId}`).then(
          (resposta) => {
            expect(resposta.status).to.eq(200);
            expect(resposta.body.nome).to.be.equal(novoDadosDeUsuario.nome);
            expect(resposta.body.senha).to.be.equal(novoDadosDeUsuario.senha);
            cy.task('gerarUsuariosFixture');

          }
        );
      });
    });
  });
});

