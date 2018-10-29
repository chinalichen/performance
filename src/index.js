import debug from 'debug';
import Client from './network/Client';

const log = debug('index.js');
log('---------------------');

const cookie = 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzgyODk5ODIsInVzZXJFbWFpbCI6ImxpLmNoZW5AY29kYXNoZWV0LmNvbSIsInVzZXJJRCI6ImNlNjJkMjg1LTQ5MjgtNDlmYS1hMzQyLTA0MmFkYWU5MGMxZiIsInVzZXJOYW1lIjoibGkuY2hlbiIsInVzZXJQaG9uZU51bWJlciI6IiJ9.iKV2AgM9MOrjuig3F_rTh9p9eAEbtYccDpQNLowIBY8;';
const client = new Client(cookie);
client.
  getBook('ee453753-5648-4683-9b3c-55ca0807f960').
  then((book) => {
    log('--------------------------------------');
    log(book);
  }).
  catch(e => {
    log('--------------------------------------');
    log(e);
  });

