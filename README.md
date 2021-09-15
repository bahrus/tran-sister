# tran-sister

tran-sister (or t-s for short) is a web component that listens for events on one sibling (typically), and, when fired, performs transforms on the host, using DTR syntax defined in [http://github.com/bahrus/trans-render][the trans-render library].

**NB:**  tran-sister considers itself part of the p-et-alia HTML framework of web components.  However, it is a bit of a "black sheep" compared to the others.  It is granted considerably more powers than the other components -- it is able to channel changes both up and down the DOM tree.  And it can execute arbitrary code as needed.

As such, the component should be used with a bit of care.

If used to transmit changes both up and down the DOM tree, combined with responding to non-user initiated events (like property changes of a web component), there is a potential danger of ending up with harmful "feedback loops."

## Syntax

```html
<button>Expand All</button>
<tran-sister 
    on=click
    transform='{
        ":host": [{"open":true,"expandAll":true,"collapseAll":false,"propx": ".lastEvent.keyCode"}]
    }'
    -cache-is-stale
></tran-sister>
```