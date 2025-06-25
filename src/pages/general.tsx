import { CONFIG } from 'src/config-global';

import { GeneralView } from 'src/sections/general/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`General - ${CONFIG.appName}`}</title>

      <GeneralView />
    </>
  );
}
