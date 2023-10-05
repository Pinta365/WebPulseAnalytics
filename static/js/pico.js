/*!
 * Minimal theme switcher and menu toggler
 *
 * Pico.css - https://picocss.com
 * Copyright 2019-2023 - Licensed under MIT
 */

const themeSwitcher = {
    // Config
    _scheme: "auto",
    menuTarget: "details[role='list']",
    buttonsTarget: "a[data-theme-switcher]",
    buttonAttribute: "data-theme-switcher",
    rootAttribute: "data-theme",
    localStorageKey: "picoPreferredColorScheme",

    // Init
    init() {
        this.scheme = this.schemeFromLocalStorage;
        this.initSwitchers();
    },

    // Get color scheme from local storage
    get schemeFromLocalStorage() {
        if (typeof window.localStorage !== "undefined") {
            if (window.localStorage.getItem(this.localStorageKey) !== null) {
                return window.localStorage.getItem(this.localStorageKey);
            }
        }
        return this._scheme;
    },

    // Preferred color scheme
    get preferredColorScheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },

    // Init switchers
    initSwitchers() {
        const buttons = document.querySelectorAll(this.buttonsTarget);
        buttons.forEach((button) => {
            button.addEventListener(
                "click",
                (event) => {
                    event.preventDefault();
                    // Set scheme
                    this.scheme = button.getAttribute(this.buttonAttribute);
                    // Close dropdown
                    document.querySelector(this.menuTarget).removeAttribute("open");
                },
                false,
            );
        });
    },

    // Set scheme
    set scheme(scheme) {
        if (scheme == "auto") {
            this.preferredColorScheme == "dark" ? (this._scheme = "dark") : (this._scheme = "light");
        } else if (scheme == "dark" || scheme == "light") {
            this._scheme = scheme;
        }
        this.applyScheme();
        this.schemeToLocalStorage();
    },

    // Get scheme
    get scheme() {
        return this._scheme;
    },

    // Apply scheme
    applyScheme() {
        document.querySelector("html").setAttribute(
            this.rootAttribute,
            this.scheme,
        );
    },

    // Store scheme to local storage
    schemeToLocalStorage() {
        if (typeof window.localStorage !== "undefined") {
            window.localStorage.setItem(this.localStorageKey, this.scheme);
        }
    },
};

const sideMenuToggle = {
    _state: "closed-on-mobile",
    toggleLink: document.getElementById("toggle-docs-navigation"),
    nav: document.getElementById("side-menu"),
    //nav: document.querySelector("main > aside > nav"),

    init: function () {
        this.onToggleClick();
    },

    onToggleClick: function () {
        if (this.toggleLink) {
            this.toggleLink.addEventListener(
                "click",
                function (e) {
                    e.preventDefault();

                    if (this.state === "closed-on-mobile") {
                        this.state = "open";
                    } else {
                        this.state = "closed-on-mobile";
                    }

                    this.nav.removeAttribute("class");
                    this.nav.classList.add(this.state);
                }.bind(this),
                false,
            );
        }
    },
    get state() {
        return this._state;
    },

    set state(value) {
        this._state = value;
    },
};

// Init
themeSwitcher.init();
sideMenuToggle.init();
