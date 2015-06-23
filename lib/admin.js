AdminConfig = {
  name: 'TIPI Backend',
  skin: 'blue',
  adminEmails: [
    'edipotrebol@gmail.com',
    'alba.gutierrez@ciecode.es',
    'javier.perez@ciecode.es',
    'raul.martin@ciecode.es'
  ],
  collections: {
    Tipis: {
        icon: 'file',
        tableColumns: [
          {label: 'ObjectID', name: '_id'},
          {label: 'Título', name: 'titulo'}
        ]
    },
    /*Refs: {
        icon: 'file',
        tableColumns: [
          {label: 'ObjectID', name: '_id'},
          {label: 'Título', name: 'titulo'}
        ]
    },*/
    Diputados: {
        icon: 'institution',
        tableColumns: [
          {label: 'ObjectID', name: '_id'},
          {label: 'Nombre', name: 'nombre'},
          {label: 'Grupo', name: 'grupo'}
        ]
    },
    Dicts: {
        icon: 'tag',
        tableColumns: [
          {label: 'Nombre', name: 'dict'},
          {label: 'Grupo', name: 'dictgroup'}
        ]
    },
    Meetups: {
        icon: 'calendar',
        tableColumns: [
          {label: 'Nombre', name: 'name'},
          {label: 'Descripción', name: 'description'},
          {label: 'Fecha', name: 'date'},
          {label: 'Activo?', name: 'active'}
        ]
    }
  }
}