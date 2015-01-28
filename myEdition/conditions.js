
function registerJsbSurvey() {

    // 1: Wie wird das Personal über den Jugendschutz informiert?
    registerRule({
        fieldGroup: '#powermail_field_veranstaltung_2, #powermail_field_veranstaltung_3, #powermail_field_veranstaltung_5',
        check: checkCheckbox,
        show: {
            true: '#powermail_fieldwrap_4'
        }
    });

    // 2: Wie werden die Gäste über den Jugendschutz informiert?
    registerRule({
        fieldGroup: '#powermail_field_wiewerdendiegsteberdenjugendschutzinformiert_6',
        check: checkCheckbox,
        show: {
            true: '#powermail_fieldwrap_9'
        }
    });

    // 3: Wie wird das Alter der Gäste beim Alkohol- oder Tabakverkauf bestimmt?
    registerRule({
        fieldGroup: '#powermail_field_marker_01_5',
        check: checkCheckbox,
        show: {
            true: '#powermail_fieldwrap_10'
        }

    });

    // 4: Welche zusätzlichen Hilfsmittel werden für die Umsetzung des Jugendschutzes eingesetzt?
    registerRule({
        fieldGroup: '#powermail_field_marker_02_5',
        check: checkCheckbox,
        show: {
            true: '#powermail_fieldwrap_11'
        }
    });

    // 5: Welche zusätzlichen Jugendschutzmassnahmen werden umgesetzt?
    registerRule({
        fieldGroup: '#powermail_field_marker_03_2',
        check: checkCheckbox,
        show: {
            true: '#powermail_fieldwrap_12'
        }
    });

    // 6: Zusätzliche Informationen - Veranstaltung
    registerRule({
        fieldGroup: '#powermail_field_artderorganisation',
        check: function (e) {return e.prop("selectedIndex");},
        base: '#powermail_fieldwrap_14, #powermail_fieldwrap_15, #powermail_fieldwrap_16, #powermail_fieldwrap_17, #powermail_fieldwrap_18, #powermail_fieldwrap_19, #powermail_fieldwrap_20, #powermail_fieldwrap_21, #powermail_fieldwrap_22',
        show: {
            '0': '#powermail_fieldwrap_14, #powermail_fieldwrap_15, #powermail_fieldwrap_16, #powermail_fieldwrap_17, #powermail_fieldwrap_18, #powermail_fieldwrap_19, #powermail_fieldwrap_20, #powermail_fieldwrap_21, #powermail_fieldwrap_22',
            '1': '#powermail_fieldwrap_14, #powermail_fieldwrap_21, #powermail_fieldwrap_22',
            '2': '#powermail_fieldwrap_14, #powermail_fieldwrap_21',
            '3,4': '#powermail_fieldwrap_14'
        }
    });
}

function checkCheckbox(e) {
    return e.prop('checked');
}

function registerRule(eventData) {
    // fallback: default for base is first shown
    if (typeof eventData.base === "undefined") {
        eventData.base = eventData.show[Object.keys(eventData.show)[0]];
    }

    $(eventData.fieldGroup).on('change', eventData, checkVisibelity);
    // init call
    $($(eventData.fieldGroup)[0]).trigger('change');
}

function checkVisibelity(event) {
    var foundActive = false;
    var baseFields = [];

    // get always an unque id
    $.each($(event.data.base), function (key, value) {
        baseFields.push($(value).getSelector());
    });

    // go through source fields
    $(event.data.fieldGroup).each(function(index, element) {
        var evaluation = event.data.check($(element));

        // search show expression
        $.each(event.data.show, function (key, val) {
            // search an valid pattern
            var patterns = key.split(',');
            var patternMatch = false;
            $.each(patterns, function (indexPattern1, patt) {
                if (patt == evaluation.toString()) {
                    patternMatch = true;
                    return false;
                }
            });

            if (patternMatch) {
                // go throug fields and shows them if necessary
                $(val).each (function (key, value) {
                    if (!$(value).is(":visible")) {
                        // $(value).show();
                        $(value).fadeIn();
                    }
                    // remove from base fields -> to avoid hide them
                    var baseFieldIndex = baseFields.indexOf($(value).getSelector());
                    if (baseFieldIndex >= 0) {
                        baseFields.splice(baseFieldIndex, 1);
                    }
                });

                foundActive = true;
                return false;
            }
        });

        // leave expression search
        if (foundActive) {
            return false;
        }
    });

    baseFields.forEach(function (element) {
        // $(element).hide();
        $(element).fadeOut();
    });
}

/**
 * Function to get a unique id for a dom object
 * Source: http://www.timvasil.com/blog14/post/2014/02/24/Build-a-unique-selector-for-any-DOM-element-using-jQuery.aspx
 * @returns {*}
 */
$.fn.getSelector = function() {
    var el = this[0];
    if (!el.tagName) {
        return '';
    }

    // If we have an ID, we're done; that uniquely identifies this element
    var el$ = $(el);
    var id = el$.attr('id');
    if (id) {
        return '#' + id;
    }

    var classNames = el$.attr('class');
    var classSelector;
    if (classNames) {
        classSelector = '.' + $.trim(classNames).replace(/\s/gi, '.');
    }

    var selector;
    var parent$ = el$.parent();
    var siblings$ = parent$.children();
    var needParent = false;
    if (classSelector && siblings$.filter(classSelector).length == 1) {
        // Classes are unique among siblings; use that
        selector = classSelector;
    } else if (siblings$.filter(el.tagName).length == 1) {
        // Tag name is unique among siblings; use that
        selector = el.tagName;
    } else {
        // Default to saying "nth child"
        selector = ':nth(' + $(this).index() + ')';
        needParent = true;
    }

    // Bypass ancestors that don't matter
    if (!needParent) {
        for (ancestor$ = parent$.parent();
             ancestor$.length == 1 && ancestor$.find(selector).length == 1;
             parent$ = ancestor$, ancestor$ = ancestor$.parent());
        if (ancestor$.length == 0) {
            return selector;
        }
    }

    return parent$.getSelector() + ' > ' + selector;
}
