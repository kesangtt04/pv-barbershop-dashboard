import { CONFIG } from 'src/config-global';

import { SalaryView } from 'src/sections/salary/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Salary - ${CONFIG.appName}`}</title>

      <SalaryView />
    </>
  );
}
