import { SelfCarePage } from './app.po';

describe('self-care App', () => {
  let page: SelfCarePage;

  beforeEach(() => {
    page = new SelfCarePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
