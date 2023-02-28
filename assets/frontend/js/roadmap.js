const defaultStickerPath = defaultScriptPath + '/sticker';
const defaultContentPath = defaultScriptPath + '/content';

const roadmapScripts = [
    {
        src: defaultStickerPath + '/Sticker.js',
        module: 'Sticker'
    },
    {
        src: defaultStickerPath + '/StickerEvents.js',
        module: 'StickerEvents'
    },
    {
        src: defaultStickerPath + '/StickerStruct.js',
        module: 'StickerStruct'
    },
    {
        src: defaultStickerPath + '/StickerType.js',
        module: 'StickerType'
    },
    {
        src: defaultContentPath + '/NavConstruct.js',
        module: 'NavConstruct'
    },
    {
        src: defaultContentPath + '/ContentConstruct.js',
        module: 'ContentConstruct'
    },
    {
        src: defaultContentPath + '/ContentDrugToScroll.js',
        module: 'ContentDrugToScroll'
    },
    {
        src: defaultContentPath + '/DragAndMoveMe.js',
        module: 'DragAndMoveMe'
    }];


roadmapScripts.forEach(_script => {
    DOCUMENT_SCRIPTS_LOADS.push(_script);
});

