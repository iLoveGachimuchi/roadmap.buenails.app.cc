<?

return array(
    'https_only' => true,
    'info' => [
        'version' => '0.1.0a'
    ],
    'contentType' => 'text',
    'acceptMethods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    'charset' => 'utf8',

    'defaultRoutes' => [
        '/install' => [
            'POST' => 'Controllers\Install@MVC',
        ],
        '/install/controller' => [
            'POST' => 'Controllers\Install@Controller',
            'DELETE' => 'Controllers\Install@Controller'
        ],
        '/install/model' => [
            'POST' => 'Controllers\Install@Model',
            'DELETE' => 'Controllers\Install@Model'
        ],
        '/install/view' => [
            'POST' => 'Controllers\Install@View',
            'DELETE' => 'Controllers\Install@View'
        ],
        '/install/route' => [
            'PUT' => 'Controllers\Install@Route',
            'DELETE' => 'Controllers\Install@Route'
        ],
    ],

    'salt'=> '&*%#5uA4A3nhw$&',
    'connection' => [
        'host' => '127.0.0.1',
        'database' => 'roadmap-manicure-app',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8mb4'
    ]
);
