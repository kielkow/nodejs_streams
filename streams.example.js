/*
Node.js streams are a powerful feature that allows you to efficiently handle data flow in a non-blocking manner. 
Streams in Node.js are built-in objects that enable you to read from or write to a source incrementally, in small chunks, 
instead of loading the entire data into memory at once.

There are four fundamental types of streams in Node.js:

1. Readable Streams: These streams represent a source from which data can be consumed. 
For example, reading data from a file, receiving data from an HTTP request, or generating data from a database query. 
Readable streams emit the `data` event whenever new data is available, and the consumer can read this data using different methods.

2. Writable Streams: These streams represent a destination to which data can be written. 
For example, writing data to a file, sending data over an HTTP response, or inserting data into a database. 
Writable streams provide methods like `write()` and `end()` to send data to the stream.

3. Duplex Streams: These streams represent both a readable and a writable stream. 
It means you can both read from and write to these streams simultaneously. 
Duplex streams are bidirectional and are commonly used for tasks like network communication.

4. Transform Streams: These streams are a special type of duplex streams that manipulate 
or transform the data as it flows from the readable side to the writable side. Transform streams 
are useful for tasks such as compression, encryption, or data formatting. 
They can be used to modify data on the fly while it is being streamed.

Streams in Node.js work on the principle of events and backpressure. Data is consumed or produced in chunks, 
and events like `data`, `end`, and `error` are emitted to notify the application about the stream's state. 
Backpressure is a mechanism used to control the flow of data when the writable stream cannot handle the incoming 
data as fast as it is being produced. It allows the readable stream to pause or slow down the data production 
until the writable stream is ready to consume more data.

To work with streams in Node.js, you typically create instances of the appropriate stream type, set up event handlers, 
and use various methods provided by the streams API to interact with the data. You can also pipe streams together, 
which means connecting the output of one stream to the input of another stream, to create a pipeline that automatically 
handles data flow between multiple streams.

Overall, Node.js streams provide an efficient and flexible way to handle data processing, especially when dealing with 
large amounts of data or scenarios where data needs to be processed incrementally.

These examples bellow, showcase different scenarios where streams can be used in Node.js, including copying files, 
compressing data, and transforming data. Depending on your specific use case, you can adapt these examples or explore 
the Node.js streams documentation for more in-depth information and additional stream-related operations.
 */

const fs = require('fs');
const zlib = require('zlib');
const { Duplex } = require('stream');
const { Transform } = require('stream');

// Reading and writing data file to another:
export const readWriteStream = () => {
    const readableStream = fs.createReadStream('input.txt');
    const writableStream = fs.createWriteStream('output.txt');

    readableStream.pipe(writableStream);

    console.log('File is being copied...');
}

// Reading data file, generating zip and writing to another file:
export const zipGenerate = () => {
    const readableStream = fs.createReadStream('input.txt');
    const gzipStream = zlib.createGzip();
    const writableStream = fs.createWriteStream('output.txt.gz');

    readableStream.pipe(gzipStream).pipe(writableStream);

    console.log('File is being compressed...');
}

// Reading input data, convert to upper case and writing on output:
export const convertInputToUpperCase = () => {
    const uppercaseTransform = new Transform({
        transform(chunk, encoding, callback) {
            const uppercasedChunk = chunk.toString().toUpperCase();
            this.push(uppercasedChunk);
            callback();
        }
    });

    process.stdin.pipe(uppercaseTransform).pipe(process.stdout);
}

// Handle with Duplex streams:
export const logChars = () => {
    const myDuplexStream = new Duplex({
        write(chunk, encoding, callback) {
            console.log(`Writing: ${chunk}`);
            callback();
        },
        read(size) {
            if (this.currentCharCode > 90) {
                this.push(null);
                return;
            }
            this.push(String.fromCharCode(this.currentCharCode++));
        }
    });

    myDuplexStream.currentCharCode = 65; // ASCII code for 'A'

    myDuplexStream.on('data', (chunk) => {
        console.log(`Received: ${chunk}`);
    });

    myDuplexStream.write('Hello');

    myDuplexStream.end();
}
/* 
When you run this code, it will write "Hello" to the duplex stream, which will be logged as "Writing: Hello". 
Then, the stream will generate and push characters starting from 'A' to the readable side. Each received chunk will 
be logged as "Received: <character>". The stream will continue pushing characters until it reaches 'Z', at which 
point it will end the stream by pushing null. 
*/
