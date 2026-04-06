import { faker } from '@faker-js/faker/locale/pt_BR'



describe('Formulário Cadastro', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Usuário deve conseguir se cadastrar com sucesso', () => {

    cy.getByData('botao-cadastro').click();
    cy.getByData('nome-input').type(faker.name.fullName());
    cy.getByData('email-input').type(faker.internet.email());
    cy.getByData('senha-input').type(faker.internet.password());
    cy.getByData('botao-enviar').click();
    cy.getByData('mensagem-sucesso').should('exist').and('have.text', 'Usuário cadastrado com sucesso!');

    cy.task('gerarUsuariosFixture');
  });
});