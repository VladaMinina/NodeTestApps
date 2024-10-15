const { Writable } = require('stream');

class CustomWritable extends Writable {
    constructor(options = {}) {
        super(options);
    }

    _write(chunk, enc, cb){
        process.stdout.write(chunk);
        cb();
    }
}

const myWritable = new CustomWritable();

process.stdin.pipe(myWritable);

/*
can be:
const options = {
    highWaterMark: 64 * 1024, // 64 KB buffer size
    objectMode: true          // Allows writing objects instead of only Buffers/Strings
};
*/