import { CONFIG } from 'src/config-global';

import { ServiceView } from 'src/sections/service/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Service - ${CONFIG.appName}`}</title>

      <ServiceView />
    </>
  );
}
