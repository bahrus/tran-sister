# tran-sister [TODO]

tran-sister (or t-s for short) is a web component that listens for events on one sibling (typically), and, when fired, performs transforms on peer  elements within the ShadowDOM realm (or light children of the nearest custom element), or the host, using DTR syntax defined in [http://github.com/bahrus/trans-render][the trans-render library].

## Syntax

```html
<button>Expand All</button>
<tran-sister 
    on=click
    do-transform='{
        ":host": [{"open":true,"expandAll":true,"collapseAll":false}]
    }'
></tran-sister>
```