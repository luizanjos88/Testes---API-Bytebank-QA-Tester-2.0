describe('Testando dispositivos móveis', () => {


  it('Deve existir um botão menu burguer', () => {
    cy.viewport('iphone-6');
    cy.task('gerarUsuariosFixture');
    cy.visit('/');
    cy.fixture('usuarios').then((usuarios) => {
      cy.getByData('botao-login').click();
      cy.getByData('email-input').type(usuarios[0].email);
      cy.getByData('senha-input').type(usuarios[0].senha);
      cy.getByData('botao-enviar').click();

      cy.location('pathname').should('eq', '/home');

      cy.getByData('menu-burguer').click();
      cy.getByData('menu-lateral').find('a').eq(4).click();

      cy.location('pathname').should('eq', '/home/investimentos');
    })
  });
})
