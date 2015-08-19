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

function builderQueryFrom(type) {
  switch(type) {
      case 'Proyecto de Ley':
          return {tipo: "121", numenmienda: {$exists: 0}}
          break;
      case 'Enmienda a Proyecto de Ley':
          return {tipo: "121", numenmienda: {$exists: 1}}
          break;
      default:
          return {}
  }
}


/* UTILS */

function cleanTipiQuery(cqry) {
    var fdesde, fhasta, newautor, newgrupootro;
    fdesde = fhasta = null;
    newautor = newgrupootro = tipo = {};
    for (var k in cqry) {
        if( k == "fechadesde" && cqry[k] != "" ) {
            fdesde = cqry[k];
            delete cqry[k];
        } else if(k == "fechahasta" && cqry[k] != "") {
            fhasta = cqry[k];
            delete cqry[k];
        } else if ((k == "autor") && (cqry[k] != "")) {
            newautor = { 'autor_diputado': {$regex: cqry['autor'], $options: "gi"} }
            delete cqry[k];
        } else if ((k == "grupootro") && (cqry[k] != "")) {
            if (cqry['grupootro'] == 'Gobierno') {
                newgrupootro = { 'autor_otro': cqry['grupootro'] }
            } else {
                newgrupootro = { 'autor_grupo': cqry['grupootro'] }
            }
            delete cqry[k];
        } else if( k == "vtipo" && cqry[k] != "" ) {
            tipo = builderQueryFrom(cqry[k]);
            delete cqry[k];
        }
        else if (cqry[k] == "") {
            delete cqry[k];
        } else if (typeof(cqry[k]) != "object") {
            cqry[k] = {$regex: cqry[k], $options: "gi"};
        }
    }
    if (newautor != {}) {
        jQuery.extend(cqry, newautor);
    }
    if (newgrupootro != {}) {
        jQuery.extend(cqry, newgrupootro);
    }
    if (tipo != {}) {
        jQuery.extend(cqry, tipo);
    }
    if (fdesde != null && fhasta != null) {
        cqry["fecha"] = {
            $gte: datestringToISODate(fdesde, true),
            $lte: datestringToISODate(fhasta, false)
        };
    } else if (fdesde != null && fhasta == null) {
        cqry["fecha"] = {
            $gte: datestringToISODate(fdesde, true)
        };
    } else if (fdesde == null && fhasta != null) {
        cqry["fecha"] = {
            $lte: datestringToISODate(fhasta, false)
        };
    }
    return cqry;
}


function cleanRefQuery(cqry) {
    var fdesde, fhasta, hayautor, tipoautor;
    fdesde = fhasta = null;
    hayautor = false;
    tipoautor = '';
    for (var k in cqry) {
        if( k == "fechadesde" && cqry[k] != "" ) {
            fdesde = cqry[k];
            delete cqry[k];
        } else if(k == "fechahasta" && cqry[k] != "") {
            fhasta = cqry[k];
            delete cqry[k];
        } else if (k == "autor") {
            hayautor = true;
        } else if (k == "tipoautor") {
            tipoautor = cqry[k];
            delete cqry[k];
        } else if (cqry[k] == "") {
            delete cqry[k];
        } else if (typeof(cqry[k]) != "object") {
            cqry[k] = {$regex: cqry[k], $options: "gi"};
        }
    }
    if (fdesde != null && fhasta != null) {
        cqry["fecha"] = {
            $gte: datestringToISODate(fdesde, true),
            $lte: datestringToISODate(fhasta, false)
        };
    } else if (fdesde != null && fhasta == null) {
        cqry["fecha"] = {
            $gte: datestringToISODate(fdesde, true)
        };
    } else if (fdesde == null && fhasta != null) {
        cqry["fecha"] = {
            $lte: datestringToISODate(fhasta, false)
        };
    }
    if (hayautor) {
        newautor = {};
        if (tipoautor == 'diputado') {
            newautor = { 'autor.diputado': {$regex: cqry['autor'], $options: "gi"} }
        } if (tipoautor == 'grupo') {
            newautor = { 'autor.grupo': {$regex: cqry['autor'], $options: "gi"} }
        } if (tipoautor == 'otro') {
            newautor = { 'autor.otro': {$regex: cqry['autor'], $options: "gi"} }
        } else {
            //
        }
        delete cqry['autor'];
        jQuery.extend(cqry, newautor);
    }
    return cqry;
}





// congreso.es URL maker
function parseCongresoURL(ref) {
    var split_ref = ref.split('/');
    return "http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&PIECE=IWA0&FMT=INITXD1S.fmt&FORM1=INITXLUS.fmt&DOCS=1-1&QUERY=%28I%29.ACIN1.+%26+%28"+split_ref[0]+"%2F"+split_ref[1]+"%29.";
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
