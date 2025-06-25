import { CONFIG } from 'src/config-global';

import { DiscountView } from 'src/sections/discount/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Discount - ${CONFIG.appName}`}</title>

      <DiscountView />
    </>
  );
}
