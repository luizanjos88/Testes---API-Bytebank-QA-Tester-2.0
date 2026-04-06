import { isMobile } from '../support/utils';

describe('Testando múltiplas páginas', () => {

  beforeEach(() => {

    cy.task('gerarUsuariosFixture');
  });

  it('Deve conseguir acessar a página de cartões', () => {
    cy.viewport('iphone-6')

    cy.fixture('usuarios').then((usuarios) => {
      cy.login(usuarios[0].email, usuarios[0].senha);

      cy.visit('/home');

      if (isMobile()) {
        cy.get('[data-test="menu-burguer"]').click();
        cy.getByData('menu-lateral').find('a').eq(4).click();

        cy.location('pathname').should('eq', '/home/investimentos');
      }

    });
  });
});
