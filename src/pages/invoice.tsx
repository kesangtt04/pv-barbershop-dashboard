import { CONFIG } from 'src/config-global';

import { InvoiceView } from 'src/sections/invoice/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Invoices - ${CONFIG.appName}`}</title>

      <InvoiceView />
    </>
  );
}
