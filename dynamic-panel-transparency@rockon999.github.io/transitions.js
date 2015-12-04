const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Settings = Me.imports.settings;
const Theming = Me.imports.theming;
const Extension = Me.imports.extension;
const Util = Me.imports.util;
const Main = imports.ui.main;
const Lang = imports.lang;
const Config = imports.misc.config;
const Panel = Main.panel;

function init(){
    if (Settings.get_force_animation()) {
        this.tweener = imports.tweener.tweener;
    } else {
        this.tweener = imports.ui.tweener;
    }
    this.tweener.registerSpecialProperty('background_alpha', Theming.get_background_alpha, Theming.set_background_alpha);
}

function cleanup(){
    this.tweener = null;
}

function fade_in(params = null) {
    if (Main.overview.visible || Main.overview._shown)
        return;
    if (params === null || Util.is_undef(params.time))
        params = {
            time: Settings.get_transition_speed()
        };
    Extension.set_transparent(false);
    Extension.set_blank(false);
    let time = params.time / 1000;
     Theming.set_panel_color();
    this.tweener.addTween(Panel.actor, {
        background_alpha: Settings.get_minimum_opacity()
    });
    this.tweener.addTween(Panel.actor, {
        time: time,
        transition: 'linear',
        background_alpha: Settings.get_maximum_opacity(),
        onComplete: fade_in_complete
    });
}

function fade_in_complete() {
    if (!Settings.get_hide_corners()) {
        show_corners();
    }
}


function fade_in_from_blank(params = null) {
    if (Main.overview._shown)
        return;
    if (params === null || Util.is_undef(params.time))
        params = {
            time: Settings.get_transition_speed()
        };

    Extension.set_transparent(true);
    Extension.set_blank(false);

    let time = params.time / 1000;

     Theming.set_panel_color();
    this.tweener.addTween(Panel.actor, {
        background_alpha: 0
    });
    this.tweener.addTween(Panel.actor, {
        time: time,
        transition: 'linear',
        background_alpha: Settings.get_minimum_opacity(),
        onComplete: fade_in_from_blank_complete
    });
}

function fade_in_from_blank_complete() {
    if (Main.overview._shown && Settings.get_minimum_opacity() > 0) {
        blank_fade_out_from_minimum();
        return;
    }
    if (!Settings.get_hide_corners()) {
        hide_corners();
    } else {
        hide_corners({
            opacity: 0
        });
    }
}


function fade_out(params = null) {
    if (params === null || Util.is_undef(params.time))
        params = {
            time: Settings.get_transition_speed()
        };

    Extension.set_transparent(true);
    Extension.set_blank(false);

    let time = params.time / 1000;

    /* we can't actually fade these, so we'll attempt to hide the fact we're jerkily removing them */
    /* always hide to update preference changes */
    if (!Settings.get_hide_corners()) {
        hide_corners();
    } else {
        hide_corners({
            opacity: 0
        });
    }
     Theming.set_panel_color();
    if (time <= 0 && !Main.overview._shown) {
        fade_out({
            time: 0
        });
    } else if (Main.overview._shown) {
        blank_fade_out({
            time: 0
        });
    } else {
        this.tweener.addTween(Panel.actor, {
            background_alpha: Settings.get_maximum_opacity()
        });
        this.tweener.addTween(Panel.actor, {
            time: time,
            transition: 'linear',
            background_alpha: Settings.get_minimum_opacity(),
        });
    }
}


/* Doesn't adhere to opacity settings. For overview and screenShield. */
function blank_fade_out(params = null) {
    if (params === null || Util.is_undef(params.time))
        params = {
            time: Settings.get_transition_speed()
        };

    Extension.set_transparent(true);
    Extension.set_blank(true);

     let time = params.time / 1000;

    /* we can't actually fade these, so we'll attempt to hide the fact we're jerkily removing them */
    /* always hide to update preference changes */

    hide_corners({
        opacity: 0
    });

     Theming.set_panel_color();
    if (time <= 0) {
        Theming.set_background_alpha(Panel.actor, 0);
    } else {
        this.tweener.addTween(Panel.actor, {
            background_alpha: Settings.get_maximum_opacity()
        });
        this.tweener.addTween(Panel.actor, {
            time: time,
            transition: 'linear',
            background_alpha: 0,
        });
    }
}

/* Doesn't adhere to opacity settings. For overview and screenShield. */
function blank_fade_out_from_minimum(params = null) {
    if (params === null || Util.is_undef(params.time))
        params = {
            time: Settings.get_transition_speed()
        };

    Extension.set_transparent(true);
    Extension.set_blank(true);

    let time = params.time / 1000;

    /* we can't actually fade these, so we'll attempt to hide the fact we're jerkily removing them */
    /* always hide to update preference changes */

    hide_corners({
        opacity: 0
    });

    Theming.set_panel_color();
    if (time <= 0) {
        Theming.set_background_alpha(Panel.actor, 0);
    } else {
        this.tweener.addTween(Panel.actor, {
            background_alpha: Settings.get_minimum_opacity()
        });
        this.tweener.addTween(Panel.actor, {
            time: time,
            transition: 'linear',
            background_alpha: 0,
        });
    }
}

/* Sadly, the current corner/panel overlap is very awkward */
function hide_corners(params = null) {
    if (params === null || Util.is_undef(params.opacity))
        params = {
            opacity: Settings.get_minimum_opacity()
        };
     Theming.set_corner_color({
        opacity: params.opacity
    });
}

function show_corners(params = null) {
    if (params === null || Util.is_undef(params.opacity))
        params = {
            opacity: Settings.get_maximum_opacity()
        };
     Theming.set_corner_color({
        opacity: params.opacity
    });
}