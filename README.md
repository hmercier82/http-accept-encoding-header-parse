# http-accept-encoding-header-parse

Parses an HTTP `Accept-Encoding` header into an ordered list of encodings and their quality factors.

```js
import { parseAcceptEncoding } from './src/index.js';

parseAcceptEncoding('gzip;q=0.5, deflate;q=0.8');
// [ { coding: 'deflate', q: 0.8 }, { coding: 'gzip', q: 0.5 } ]
```

The library exists because HTTP content negotiation needs a deterministic ordering of encodings. The header grammar allows multiple parameters, but only `q` is meaningful for quality; any other parameter makes the entry invalid and it is dropped. The trade-off is strictness: entries with malformed or unknown parameters are discarded rather than partially parsed, which keeps the output predictable for negotiation logic.

The awkward edge is the wildcard `*` and `q=0`. The wildcard is returned as a normal coding token named `*`, and `q=0` entries are kept in the result (sorted last) so callers can decide whether to treat them as unacceptable. Empty segments between commas are ignored, and a missing `q` defaults to `1.0`. The parser also trims surrounding whitespace and treats the `q` parameter name case-insensitively.
