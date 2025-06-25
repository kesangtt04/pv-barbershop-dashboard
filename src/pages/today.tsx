import { CONFIG } from 'src/config-global';

import { TodayScheduleView } from 'src/sections/today/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Today Schedule - ${CONFIG.appName}`}</title>

      <TodayScheduleView />
    </>
  );
}
