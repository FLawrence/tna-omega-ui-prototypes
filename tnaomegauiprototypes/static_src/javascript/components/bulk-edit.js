class BulkEdit {
    static selector() {
        return '[data-bulk-update]';
    }

    constructor(node) {
        this.node = node;
        this.checkboxes = document.querySelectorAll('[data-bulk-update]');
        this.bulkMenu = document.querySelectorAll('[data-bulk-menu]');
        this.hiddenClass = 'd-none';
        this.bindEvents(node);
    }

    atLeastOneCheckboxIsChecked() {
        const checkboxes = Array.from(this.checkboxes);
        return checkboxes.reduce((acc, curr) => acc || curr.checked, false);
    }

    checkActive() {
        if (this.atLeastOneCheckboxIsChecked() === true) {
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
        node.addEventListener('change', () => {
            this.atLeastOneCheckboxIsChecked();
            this.checkActive();
        });
    }
}

export default BulkEdit;
