AdminConfig = {
    name: 'TIPI Backend',
    adminEmails: [
        'pablo.martin@enreda.coop',
        'javier.perez@ciecode.es'
    ],
    collections: {
        Iniciativas: {
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
                {label: 'Nombre', name: 'name'},
                {label: 'Grupo', name: 'group'}
            ]
        },
        Banners: {
            icon: 'list',
            tableColumns: [
                {label: 'Titulo', name: 'titulo'},
                {label: 'Destacado', name: 'destacado'},
                {label: 'Activo', name: 'activo'}
            ]
        },
        News: {
            icon: 'list',
            tableColumns: [
                {label: 'Titulo', name: 'titulo'}
            ]
        }
    }
}
