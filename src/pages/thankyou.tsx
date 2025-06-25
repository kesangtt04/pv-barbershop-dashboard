import { CONFIG } from 'src/config-global';

import { ThankYouView } from 'src/sections/thankyou';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Thank you for choosing us! | Error - ${CONFIG.appName}`}</title>

      <ThankYouView />
    </>
  );
}
