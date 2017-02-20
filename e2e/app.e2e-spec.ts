import { PlanningPokerKitPage } from './app.po';

describe('planning-poker-kit App', () => {
  let page: PlanningPokerKitPage;

  beforeEach(() => {
    page = new PlanningPokerKitPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
