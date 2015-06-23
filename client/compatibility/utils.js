var parliamentarygroups = {
    'GP': 'Grupo Popular',
    'GS': 'Grupo Socialista',
    'GC-CiU': 'Grupo Catalán - Convergencia i Unió',
    'GIP': 'Grupo La Izquierda Plural',
    'GV (EAJ-PNV)': 'Grupo Vasco - EAJ PNV',
    'GUPyD': 'Grupo Unión Progreso y Democracia',
    'GMx': 'Grupo Mixto'
}

var parliamentarygroups_colors = {
    'GP': '#58c3ed',
    'GS': '#e61a26',
    'GC-CiU': '#254a90',
    'GIP': '#c71431',
    'GV (EAJ-PNV)': '#489334',
    'GUPyD': '#e10e83',
    'GMx': '#fabb2e'
}

var datepickeroptions = {
    format: "dd/mm/yyyy",
    todayHighlight: true
}

// The parameter isfrom indicates that it will be the start of the day
function datestringToISODate(d, isfrom) {
    var dparts = d.split("/");
    if (isfrom) {
        return new Date(dparts[2], dparts[1]-1, dparts[0], 0, 0, 0)
    } else {
        return new Date(dparts[2], dparts[1]-1, dparts[0], 23, 59, 59)
    }
}