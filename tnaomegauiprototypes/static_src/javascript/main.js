import '@babel/polyfill';

import BulkSelectAll from './components/bulk-select-all';
import BulkEdit from './components/bulk-edit';

import '../sass/main.scss';

document.addEventListener('DOMContentLoaded', () => {
    /* eslint-disable no-restricted-syntax, no-new */

    for (const bulkselectall of document.querySelectorAll(
        BulkSelectAll.selector(),
    )) {
        new BulkSelectAll(bulkselectall);
    }

    for (const bulkedit of document.querySelectorAll(BulkEdit.selector())) {
        new BulkEdit(bulkedit);
    }
});
