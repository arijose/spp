import { AngularCliStarterKitPage } from './app.po';

describe('angular-cli-starter-kit App', function() {
  let page: AngularCliStarterKitPage;

  beforeEach(() => {
    page = new AngularCliStarterKitPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
