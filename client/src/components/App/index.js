import React from 'react';

import List from 'src/components/List';

import './index.scss';

const API_URL_SEARCH = 'api/esearch';

class App extends React.Component {
    render() {
        const template = item => <li key={item._id}>
            <img src={getFaviconByUrl(item.url)} title={item.sourceId} />
            <a href={item.url} target='_blank'>{item.title}</a>
            <div className='rating' 
                dangerouslySetInnerHTML={{__html: item.rating ? `${item.rating}/5` : '' }} 
            />
            <div className='description' 
                dangerouslySetInnerHTML={{__html: item.description}} 
            />
            <div className='dateFrom' 
                dangerouslySetInnerHTML={{__html: item.dateFrom || ''}} 
            />
        </li>

        return (
            <React.Fragment>
                <List
                    url={API_URL_SEARCH}
                    template={template}
                />
            </React.Fragment>
        )
    }
}

function getFaviconByUrl(url) {
    const _url = new URL(url);
    switch (_url.host) {
        case 'www.coursera.org':
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAUzSURBVGhD7Zj5c1NVFMfz14mi6IiOCzrujo7r6LiNu46KlAJFAQVRELEsopUdFVkUSJu2aUP30jZd0jVd0pY2KWl7vJ9LXpqk9y2BHyIz+c6cdpred+79nnvO95wXn9ziKBIoNIoECo0igUKjSKDQKBIoNDwTmF9YlOl4Ukam5qR/PC69o7MyOj0niWsLsphaky8SyQUZUz56lK/O4avSNzYrEzPXJDnv3aMjAQ4djs7I4dpB+eJIu7ywOySPbw/KI9tq5MEt1fLUd0F5c1+T7DjbLf4r4xJTm7vhamJegt0x2f1Pr7xzoEn5qNO+7tsckIe21siz39fLR7+2SLk/Is39U5qkE4wE4E9UtvzVJWuU0xUll+S2dc5214ZKeWnPZTleP6QPmQtu6t+2UXlrf5Pcs6nK6CPXVitSn/3epoks2lzKMgJE/XTjiDy5I2h06mZEMtQ7mfJ2HaTdhhMdsmpjpfEZN+NmDlb1S1wFIRdZBDj80eCQ3FvmLUIm+/i3VpmdW7qBgYm4ThXT2nxsZalftp8JZ/kGWQSI/M0c/v6vAlKn8tsCNfFJRatx7Y0YJPar2ljIyKc0AXKeojQ96NU2/9GpbxHwe+e5bllhWHczRpBqwhN6D6AJsBmbmx6w7PYSvzy9s06+PNqui7vsVKdWIOvGHv2mVjqUFFoIdE7oIsz1k2kU/os/hnR94PPzw21a5djLtN6yDw61pFNJE+hWUrlGSaNpMfbA19WyT13d8GQifX38pKiQxHcPNsvei336c8DnSKHJl2UvK8U63zIqk7PJdB8hkNRM+aWIllbTcxgqVt11/RY0gWN1Q7ZXvbosIGeaoo7Nako1uOlEMvWX6J7gJJVIKQe1A3udbY5qRTM9j1HQwEdA1x27YlyEbTrZIclUXnsBjQclMvnC6CstA9Op1fbgXNSQyQf2tgoCaeSbUT9e/7nRuGjler9cbB9LufQGUopbM/nD9lzodbzNTDRGpmxVkXokpX3kIPloWkQa0AW9Yk5Fn5HD5At77od6valXDMYS8ti3tUZfiEbfWFx85O8rNgRQidrwkq67AXmzixjKwkyVD7pGZmyL+Rl1A3R4HzOKU6dk6PIC8tEp91/9qUGiakNS1itOqLnKTlLJmpjKHq1C206HjYuwJ9RMRCTcgJJxYyYfdNC/lZLRGz6taJOIGsfdQHow/Zr8YWtVqiIumsAFVah3ltoPWm+UN0qrUg7TREjkObyTbtMnyP33VQPib26DYre6dib4hIA5ZQXTMVMv0AR4ibCrA8uQv62qW0KWwkYh/mwY0YeyizyGEFR1jOs5KzNIjAR0YFSOAzPK1PfEZNf5HtvCtez5XSGdjmkC4GRo2PEWLENaKVQO5tbyMVSJ6L+2t8H4f/ak0zMy363GbbfZifVW9EGaAO1//XH7hnYjxpsbTauiZsATWTeDXKm6tcyROk0AECny1fRwvkYzO3V5WAfmQ5e5yItxeNKV9/BMZBEAQ6p5oBR3qFQxOfJipAMpaQ1+CACvm6a1XgwVK1HjTjTn8GAZAUBz4xWOYspnnmej935ploa+5e+wDG+MzE4DWq6hNrz085Zo1z+MBAD7owyMtsgohUYBZ22gbJVSIHrFWvWecE6Nx5lTaS74ugRyfIvBewBikPuFAUX6sLpBUpnagfhysV2CLYFMUDR8vYKEHgkO6tc6bogcR8+pnXwmVlYyg1HgjOqHAgNyoDKi+wmSy/dDTAhe4InA/xlFAoVGkUChUSRQaBQJFBpFAoXGLU5A5D9XUiwGwl/44gAAAABJRU5ErkJggg==';
        case 'www.khanacademy.org':
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAALoSURBVFhH1ZfNTxNBGMZRD+oJTfxIxIsevZh4Mv4H6kHjwX/Ak149QdSjHq0aUTAxRjDGkwLFUhTwC5FqBAlS8KMF1EqrrcUWjVb6Os9mZjO7++50W0yIv+RJ2pn3fefpdmZ2po5qoFQu07nECG2/f9USPqOtFqo20JuZoR3916mu46xDaENftQQ28H5hng7GujwDu4UYxAalooHinxI1xQdpdfgCOyAnxCIHuZUwGmj/OEkNvVfYQYIIuahhgjXwIp+mPY9vsUVrEWqhJofDQPrXDzoyeo9WdobYQksRaqI2xtCxDWAG199tZpPdWtfdTK3TY5T6WbTUkhyz2rhYtzCGvlpsA9vEeuYS3FrVEaJnuRSVxbrXNZRNWX1cjlsYS2Eb4AI57R+67RlcCX1cDidF1QaOjz9kB4fQx+VwUvx/T8BvDqAt6ByAFKyBO6l3lCjmKZqepmOv+mhT5LKjP8gq2ChyjorcnnTSqoWaer+CNYCBdYql33RSbK1rus474jgh5sSE2IZFjg6M6HEK1sCND3HZ6mQ499nzNHThV2M5cqCmHqtgDTRNPJGtXt4WvtF6ZsPCXzBVyMkoL6ipxytYA7sf3ZStPJG5JK3Q4qHwXEL28qCmHq9gDUCD2U+yh+fw87Ade0icAUygll4bUvga2CvWtIn496z9FMbnv8pWnn3M/qDwNQD1f5mVvTy7HrTTzoE2+Y1nQNTgaiuMBuq7L9KIz3scYGk2GibsaD5j1eBqK4wGoM09LTRZyMooJ+1iaV2beS2/OcGKQC5XE1LYBkyv47Vic8GvdW8ufZlZz6a1IGJOxZ9aOVwtiH0dBzmQNERb6fTUML0Uf0tpcdEyBOEz2s68idHWqPkM6XsgAdUcybACNkQuWXLvCZwqHsl0lu1QqoOLVpuYZFsqPFKTkIsapkubrwEFLheNNVxMkLPki4kOrlsHYp3sgLoQ80+vZm4wg5flcqqDq3hIu57jc23Xc6K/STeYbJUjusYAAAAASUVORK5CYII=';
        case 'stepik.org':
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAPaSURBVHhe3ZlBa9wwEIX31+aca8655pxr8huSY/ITCoEeCoFCINDSkkChEGih4PKZTNBuxvKMRmO7ffBYs5bGes/2SCPvhgXw+PI43Hy7Gc4/nw8nH0+Gow9HKjlHG9rSZwmkGfDy52UUcvrpVBVrIX2JQawspBhw9eVqOL47VkW1kFjEzEBXA3hsa494lMTu/Wp0M4BHVRt0BrlWL3Qx4PLhUh1oJrlmD4QNWEO8sIcJIQPWFC+MmtBswBbECyMmNBmwJfHCVhPcBkTFs7i5/no93P24G+5/3o/kmP8iiybYYoLLgIj4i4eL4fn382ukadCGtloMC70mmA1oFc8qjrvsBX1aV5MeE0wGRMRHVm6YoMW10GrCrAFriacAWiInVA34l8UL50yYNOB/EC+smaAasJR4Mn45M2SIF06Z8M6A1qrOI552Z/dnb305JuFliRdqVeSeAQxM6zhHr3jaa3GW4OE49wxo2czIFk97nhBh1Dw0lngzgC0nrUONWeIZ5O3328mVI/9zvnX3qdxeGw0g+bTcmQzx1AQeYETL2NEMRgO8iS9DvCfmITwGCyUhjgZ4su/WxAu8JqAZ7OioNZiitbBZUrzAWztw3Z3n8adMtWAN8QJPKY32HZ+itJMap7JyiTXFA8aoXU8j2nfWqUTemRoyxJOtyfTcWX4le9dgzWlo32knNM5NTxnitZiW/oy17FOj2QD27Woo1/ZTjIoXcq0aGKvWT6PZgFr2t7x3vcQLa/nIMxssYkBv8XBxA1pfgQzxq7wCLUkwQ7wlpisJ9pwGW6Ys0FM8cE2DvRdCXvQWb0nIwnEhlLEUtqK3eOBeChNYOznF2mzgQYZ4T/aHxE0th6eQId4aUyg5LX1D5BBbEA/RDEJbYmR6D6zTU7Z42ssMNRoAWjZFIVMJRkzNEPzPeet0my0evtsUFVgHOUUGwypN2HJnssWjscSeAQTVOi3BJcTDw2vsGQC8CdFLsi/TVVk7cLyEeEl8Jd4ZAFo/js4R8eXymPzgWV1GxJs/jgp6m3Ao3osM8WDSANDLhK2KB1UDQNSELYsHswaAiAmR2iFbPDAZAFpNQECLCfTJFg/MBoDIk0CZasn4tPGUtIf0iAcuA0DEBEhOoCZg3467DDnmP85pfaz0igduA0DUhAy2iAdNBoAtmdAqHjQbALZgQkQ8CBkA1jQhKh6EDQBrmNBDPOhiAMiuIktqVV0ruhkAWLlFN1VqJDbX6ImuBgjYcmpdxWkkVrmN1RMpBgAKIB7VyOKGvsSIFFNzSDOgBI8tQvgUVXtFOEcb2j79enrtnYlh+AuMMk9aH7G58gAAAABJRU5ErkJggg==';
        case 'openedu.ru':
            return 'data:image/png;base64,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';
        default:
            // @TODO: add default favicon
            return;
    }
}

export default App;