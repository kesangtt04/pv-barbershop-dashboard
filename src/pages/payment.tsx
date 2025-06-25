import { CONFIG } from 'src/config-global';

import { PaymentView } from 'src/sections/payment/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Payment - ${CONFIG.appName}`}</title>

      <PaymentView />
    </>
  );
}
