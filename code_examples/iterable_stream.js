/*
The stream.Readable.from() method is an inbuilt 
application programming interface of the Stream 
module which is used to construct Readable Streams
out of iterators.
stream.Readable.from( iterable, options)
*/

import { Readable } from 'stream';

const iterable = {
    from: 1,
    to: 10,
    [Symbol.iterator]() {
        return {
            current: this.from,
            last: this.to,
            next() {
                if (this.current < this.last) {
                    return {
                        done: false,
                        value: this.current++
                    };
                }

                return {
                    done: true,
                    value: this.current
                }
            }
        }
    }
}

const readableFromIterable = Readable.from(iterable);
readableFromIterable.on('data', (chank) =>{
    console.log(chank);
})