# we need easy way to dynamicly load diffrent player interface, related to his
# situation, for example - in travel, in city, player is game master etc.
# for now it will be only mainbar (on the middle of screen)

namespace 'Alcarin.Game.Interfaces', (exports, Alcarin) ->
    exports.Default =
        mainbar: [
            { href: '#/home', icon: 'icon-globe' }
            # { href: '#/chars', icon: 'icon-globe' }
        ]

