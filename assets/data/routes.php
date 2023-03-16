<?

return [
    '/' => 'Controllers\Index@Home',

    '/prototypes' => 'Controllers\Index@Prototypes',

    '/constructor' => 'Controllers\Constructor@Index',

    '/stickers' => 'Controllers\Index@Stickers',
    '/stickers/modal/:any' => 'Controllers\Index@StickersModal',


];
