import _ from 'lodash';
import { log, table } from './utils/console';
import Client from './network/Client';

log('---------------------');

// const localhostCookie = 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzgyODk5ODIsInVzZXJFbWFpbCI6ImxpLmNoZW5AY29kYXNoZWV0LmNvbSIsInVzZXJJRCI6ImNlNjJkMjg1LTQ5MjgtNDlmYS1hMzQyLTA0MmFkYWU5MGMxZiIsInVzZXJOYW1lIjoibGkuY2hlbiIsInVzZXJQaG9uZU51bWJlciI6IiJ9.iKV2AgM9MOrjuig3F_rTh9p9eAEbtYccDpQNLowIBY8;';
// const localhost = new Client('ws://localhost:9898/api/ws', localhostCookie);

const localUbuntuCookie = 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NDAyNjIxOTMsInVzZXJFbWFpbCI6ImxpLmNoZW5AY29kYXNoZWV0LmNvbSIsInVzZXJJRCI6IjA2MjQ0ZmEyLTIwNjAtNGZmYy1iOWI5LWI5MDBjMWM1ZDYwMSIsInVzZXJOYW1lIjoibGkiLCJ1c2VyUGhvbmVOdW1iZXIiOiIifQ.AuWU2uy3shqgXBZCk7l8H6C792JGMQAoGW7r2hwSSUc';
const localUbuntu = new Client('ws://192.168.1.24/api/ws', localUbuntuCookie);

function printBookStatistic(book) {
  if (!book) {
    log('book is not exists');
  }
  const labels = _.get(book, 'labels.length', 0);
  const sheets = _.get(book, 'sheets.length', 0);
  const data = _.get(book, 'sheets', []).reduce((result, s) => {
    let { views, rows, columns, viewRows } = result;
    views += _.get(s, 'views.length', 0);
    rows += _.get(s, 'rows.length', 0);
    columns += _.get(s, 'columns.length', 0);
    viewRows += (s.views || []).reduce((count, v) => _.get(v, 'rows.length', 0) + count, 0);
    return { ...result, views, rows, columns, viewRows };
  }, { views: 0, rows: 0, columns: 0, viewRows: 0 });
  table({ labels, sheets, ...data });
}

let count = 1;
setInterval(() => {
  const start = Date.now();
  localUbuntu
    .getBook('4981ff03-971e-43e1-b9c8-15aee034f3b8')
    .then((book) => {
      log(count++, 'received a book, id:', book.id, ' cost', (Date.now() - start) / 1000, 's');
      printBookStatistic(book);
    }).catch(e => log(e));
}, 2000);
