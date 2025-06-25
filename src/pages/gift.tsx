import { CONFIG } from 'src/config-global';

import { GiftView } from 'src/sections/gift/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Gifts - ${CONFIG.appName}`}</title>

      <GiftView />
    </>
  );
}
