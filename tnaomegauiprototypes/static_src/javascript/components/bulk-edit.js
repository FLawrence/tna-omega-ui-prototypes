class BulkEdit {
    static selector() {
        return '[data-bulk-update]';
    }

    constructor(node) {
        this.node = node;
        this.bulkMenu = document.querySelectorAll('[data-bulk-menu]');
        this.hiddenClass = 'd-none';
        this.bindEvents(node);
    }

    checkActive() {
        const isChecked = this.node.checked;
        if (isChecked) {
            this.displayBulkEdit();
        } else {
            this.hideBulkEdit();
        }
    }

    displayBulkEdit() {
        this.bulkMenu.forEach((el) => {
            el.classList.remove(this.hiddenClass);
        });
    }

    hideBulkEdit() {
        this.bulkMenu.forEach((el) => {
            el.classList.add(this.hiddenClass);
        });
    }

    bindEvents(node) {
        node.addEventListener('change', (e) => {
            this.checkActive(e);
        });
    }
}

export default BulkEdit;
