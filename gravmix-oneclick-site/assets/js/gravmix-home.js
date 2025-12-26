(function () {
    function initAccordion() {
        document.querySelectorAll('.gravmix-accordion').forEach(function (accordion) {
            var button = accordion.querySelector('.gravmix-accordion__toggle');
            if (!button) return;
            button.addEventListener('click', function () {
                accordion.classList.toggle('is-open');
            });
        });
    }

    function initTabs() {
        var tabs = document.querySelectorAll('.gravmix-tab');
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var target = tab.getAttribute('data-tab');
                tabs.forEach(function (item) {
                    item.classList.toggle('is-active', item === tab);
                });
                document.querySelectorAll('.gravmix-tab-content').forEach(function (content) {
                    content.classList.toggle('is-active', content.id === target);
                });
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initAccordion();
        initTabs();
    });
})();
