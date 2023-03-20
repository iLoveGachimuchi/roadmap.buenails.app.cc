<?

return [
    '/' => 'Controllers\Index@Home',

    '/prototypes' => 'Controllers\Index@Prototypes',

    '/login' => 'Controllers\Login@LoginPage',
    '/signin' => 'Controllers\Login@SigninPage',
    '/user/signout' => 'Controllers\Login@Signout',


    '/user/login' => [
        'POST' => 'Controllers\Login@Login'
    ],
    '/user/signin' => [
        'POST' => 'Controllers\Login@Signin'
    ],


    '/constructor' => 'Controllers\Constructor@Index',



    '/stickers' => 'Controllers\Index@Stickers',
    '/stickers/modal/:any' => 'Controllers\Index@StickersModal',
];
