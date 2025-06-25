import { CONFIG } from 'src/config-global';

import { ReviewView } from 'src/sections/review/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Review - ${CONFIG.appName}`}</title>

      <ReviewView />
    </>
  );
}
