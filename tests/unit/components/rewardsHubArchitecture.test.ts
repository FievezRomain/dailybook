import fs from 'node:fs';
import path from 'node:path';

const screen = fs.readFileSync(
  path.resolve(__dirname, '../../../features/rewards/screens/RewardsHubScreen.tsx'),
  'utf8',
);
const missions = fs.readFileSync(
  path.resolve(__dirname, '../../../features/rewards/components/RewardMissionsView.tsx'),
  'utf8',
);

describe('Vascor hub architecture', () => {
  it('separates the hub into focused, navigable sections', () => {
    expect(screen).toContain("type HubSection = 'missions' | 'grades' | 'activity' | 'store'");
    expect(screen).toContain('<TabBar');
    expect(screen).toContain("useRewardHistoryQuery(section === 'activity')");
  });

  it('keeps progression, Premium and earning opportunities visible', () => {
    expect(screen).toContain('<RewardHero');
    expect(missions).toContain('<PremiumBonusCard');
    expect(missions).toContain('<OpportunitiesCard');
  });
});
