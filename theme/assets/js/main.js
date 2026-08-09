(() => {
    const toggle = document.querySelector('[data-menu-toggle]');
    const navigation = document.querySelector('[data-site-navigation]');

    if (!toggle || !navigation) {
        return;
    }

    const setMenuState = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('menu-open', open);
    };

    toggle.addEventListener('click', () => {
        setMenuState(toggle.getAttribute('aria-expanded') !== 'true');
    });

    navigation.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            setMenuState(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuState(false);
            toggle.focus();
        }
    });

    window.matchMedia('(min-width: 761px)').addEventListener('change', (event) => {
        if (event.matches) {
            setMenuState(false);
        }
    });
})();
