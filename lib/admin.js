AdminConfig = {
    name: 'TIPI Backend',
    adminEmails: [
        'pablo.martin@enreda.coop',
        'javier.perez@ciecode.es'
    ],
    collections: {
        Tipis: {
            icon: 'file',
            tableColumns: [
                {label: 'ObjectID', name: '_id'},
                {label: 'Título', name: 'titulo'}
            ]
        },
        Grupos: {
            icon: 'institution',
            tableColumns: [
                {label: 'ObjectID', name: '_id'},
                {label: 'Nombre', name: 'nombre'},
                  {label: 'Acrónimo', name: 'acronimo'}
            ]
        },
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
        Banners: {
            icon: 'list',
            tableColumns: [
                {label: 'Titulo', name: 'titulo'},
                {label: 'Destacado', name: 'destacado'},
                {label: 'Activo', name: 'activo'}
            ]
        }
    }
}
