import _ from 'lodash';
import { log, table } from './utils/console';
import Client from './network/Client';

log('---------------------');

const localhostCookie = 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzgyODk5ODIsInVzZXJFbWFpbCI6ImxpLmNoZW5AY29kYXNoZWV0LmNvbSIsInVzZXJJRCI6ImNlNjJkMjg1LTQ5MjgtNDlmYS1hMzQyLTA0MmFkYWU5MGMxZiIsInVzZXJOYW1lIjoibGkuY2hlbiIsInVzZXJQaG9uZU51bWJlciI6IiJ9.iKV2AgM9MOrjuig3F_rTh9p9eAEbtYccDpQNLowIBY8;';
const localhost = new Client('ws://localhost:9898/api/ws', localhostCookie);

const localUbuntuCookie = 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NDAyNjIxOTMsInVzZXJFbWFpbCI6ImxpLmNoZW5AY29kYXNoZWV0LmNvbSIsInVzZXJJRCI6IjA2MjQ0ZmEyLTIwNjAtNGZmYy1iOWI5LWI5MDBjMWM1ZDYwMSIsInVzZXJOYW1lIjoibGkiLCJ1c2VyUGhvbmVOdW1iZXIiOiIifQ.AuWU2uy3shqgXBZCk7l8H6C792JGMQAoGW7r2hwSSUc';
const localUbuntu = new Client('ws://192.168.1.24/api/ws', localUbuntuCookie);

const finesheetCookie = 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzgxMTQ3MDksInVzZXJFbWFpbCI6ImxpLmNoZW5AY29kYXNoZWV0LmNvbSIsInVzZXJJRCI6IjFiN2QyMjZkLTU1ZDUtNGYxNS1hNzU0LTY0YTdlNjIzNDMyMCIsInVzZXJOYW1lIjoid2lsbGkiLCJ1c2VyUGhvbmVOdW1iZXIiOiIifQ.b_OInGNt-Wd_ffSFP-Sfw0116PWowwudsh9rmgAAwlI';
const finesheet = new Client('ws://finesheet.com/api/ws', finesheetCookie);

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

let sendCount = 1;
let recvCount = 1;
let totalCost = 0;
setInterval(() => {
  log(`${sendCount++} query a book at ${(new Date()).toJSON()}`);
  const start = Date.now();
  // localhost.getBook('3ef9eb19-bb7c-4a44-ade2-8bcd47cc3962') // D://localhost
  // localhost.getBook('d38a50c1-9c42-4678-be22-f86fe62505a5') // F://localhost
  // localUbuntu.getBook('4981ff03-971e-43e1-b9c8-15aee034f3b8') // 192.168.1.24
  finesheet.getBook('8b5ada19-ceb4-4428-9f81-f86654e38518') // finesheet.com
    .then((book) => {
      const cost = Date.now() - start;
      totalCost += cost;
      log(`${recvCount} received a book at ${(new Date()).toJSON()}, id: ${book.id} cost ${cost / 1000}s, avg:${totalCost / recvCount / 1000}s`);
      recvCount++
      printBookStatistic(book);
    }).catch((e) => {
      log(e)
    });
}, 1000);
