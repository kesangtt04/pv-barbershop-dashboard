import { CONFIG } from 'src/config-global';

import { RedemptionView } from 'src/sections/redemption/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Redemption - ${CONFIG.appName}`}</title>

      <RedemptionView />
    </>
  );
}
