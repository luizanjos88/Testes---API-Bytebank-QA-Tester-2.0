import { faker, Faker } from "@faker-js/faker";
import Chance from "chance";
const chance = new Chance
const valorTransferido = chance.natural({ min: 1, max: 200 })

describe('Jornadas de usuário', () => {
  it('Deve permitir que a pessoa usuária acesse a aplicação, realize uma transação e faça um logout', () => {
    cy.task('gerarUsuariosFixture')
    cy.fixture('usuarios').then((usuarios) => {
      cy.visit('/');

      cy.getByData('botao-login').click();
      cy.getByData('email-input').type(usuarios[33].email);
      cy.getByData('senha-input').type(usuarios[33].senha);
      cy.getByData('botao-enviar').click();

      cy.location('pathname').should('eq', '/home');

      cy.getByData('select-opcoes').select('Transferência');
      cy.getByData('form-input').type(valorTransferido);
      cy.getByData('realiza-transacao').click();

      cy.getByData('lista-transacoes').find('li').last().contains(valorTransferido);

      cy.getByData('botao-sair').click();
      cy.location('pathname').should('eq', '/');
    })
  });
});
