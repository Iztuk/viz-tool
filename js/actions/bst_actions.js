// Actions panel configuration
const actionsWidth = 150;
const statusCodetraceWidth = 420;

let isSearchOpen = false;
let isInsertOpen = false;
let isRemoveOpen = false;

const openSearch = () => {
    if (!isSearchOpen) {
        $('#find-min').animate({ width: "+=65" }, 100, () => {
            $('#find-max').animate({ width: "+=69" }, 100, () => {
                $('#search-input').animate({ width: "+=32" }, 100, () => {
                    $('#search-go').animate({ width: "+=34" }, 100);
                });
            });
        });
    }
    isSearchOpen = true;
};

const closeSearch = () => {
    if (isSearchOpen) {
        $('#search-err').html("");
        $('#search-go').animate({ width: "-=34" }, 100, () => {
            $('#search-input').animate({ width: "-=32" }, 100, () => {
                $('#find-max').animate({ width: "-=69" }, 100, () => {
                    $('#find-min').animate({ width: "-=65" }, 100);
                });
            });
        });
        isSearchOpen = false;
    }
};

const openInsert = () => {
    if (!isInsertOpen) {
        $('#insert-input').animate({ width: "+=132" }, 250, () => {
            $('#insert-go').animate({ width: "+=34" }, 100);
        });
    }
    isInsertOpen = true;
};

const closeInsert = () => {
    if (isInsertOpen) {
        $('#insert-err').html("");
        $('#insert-go').animate({ width: "-=34" }, 100, () => {
            $('#insert-input').animate({ width: "-=132" }, 250);
        });
        isInsertOpen = false;
    }
};

const openRemove = () => {
    if (!isRemoveOpen) {
        $('#remove-input').animate({ width: "+=132" }, 250, () => {
            $('#remove-go').animate({ width: "+=34" }, 100);
        });
    }
    isRemoveOpen = true;
};

const closeRemove = () => {
    if (isRemoveOpen) {
        $('#remove-err').html("");
        $('#remove-go').animate({ width: "-=34" }, 100, () => {
            $('#remove-input').animate({ width: "-=132" }, 250);
        });
        isRemoveOpen = false;
    }
};

const hideEntireActionsPanel = () => {
    closeSearch();
    closeInsert();
    closeRemove();
    hideActionsPanel();
};

$(document).ready(() => {
    // Actions with pullout inputs
    $('#search').on('click', () => {
        closeInsert();
        closeRemove();
        openSearch();
        $('#inorder-err').html("");
    });

    $('#insert').on('click', () => {
        closeSearch();
        closeRemove();
        openInsert();
        $('#inorder-err').html("");
    });

    $('#remove').on('click', () => {
        closeSearch();
        closeInsert();
        openRemove();
        $('#inorder-err').html("");
    });

    // Other actions
    $('#inorder').on('click', () => {
        closeSearch();
        closeInsert();
        closeRemove();
    });

    // Tutorial mode
    $('#bst-tutorial-2 .tutorial-next').on('click', () => showActionsPanel());
    $('#bst-tutorial-3 .tutorial-next').on('click', () => hideEntireActionsPanel());
    $('#bst-tutorial-4 .tutorial-next').on('click', () => showStatusPanel());
    $('#bst-tutorial-5 .tutorial-next').on('click', () => {
        hideStatusPanel();
        showCodetracePanel();
    });
    $('#bst-tutorial-6 .tutorial-next').on('click', () => hideCodetracePanel());
});
