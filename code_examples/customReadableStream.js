import { Readable } from 'stream';
import fs from 'fs';

class ReadableStream extends Readable {
    constructor(filename) {
        super();
        this.filename = filename;
        this.fd = null;
    }

    _construct(calback) {
        fs.open(this.filename, (err, fd) => {
            if (err) {
                calback(err);
            } else {
                this.fd = fd;
                calback();
            }
        });
    }

    _read(n) {
        const buffer = Buffer.alloc(n);
        fs.read(this.fd, buffer, 0, n, null, (err, byteRead) => {
            if (err) {
                this.destroy(err);
            } this.push(byteRead > 0 ? buffer.slice(0, byteRead) : null)
        })
    }

    _destroy(err, callback) {
        if (this.fd) {
            fs.close(this.fd, (er) => callback(er || err));
        } else {
            callback(err);
        }
    }
}

const readable = new ReadableStream('./file.txt');
readable.setEncoding('utf8');

readable.on('data', (chunk) => {
    const chunkString = chunk.toString();
    console.log(chunkString);
})


/*fs.read(fd, buffer, offset, length, position, callback)
Parameters:

fd: File descriptor returned by fs.open() method.
buffer: Stores the data fetched from the file.
offset: Offset in the buffer indicating where to start writing.
length: An integer that specifies the number of bytes to read.
position: An integer that specifies where to begin reading from in the file. If the position is null, data is read from the current file position.
callback: The callback function accepts the three arguments ie. (err, bytesRead, buffer).
err: An Error object is provided if an error occurs during the read operation. Otherwise, it is null.
bytesRead: The number of bytes read from the file.
buffer: The buffer object passed to the method, filled with the data read fro */