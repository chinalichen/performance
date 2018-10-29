import { UserRole, Publish, ResourceMetadata } from './fragments';

export function getBookQuery(workbookID) {
  const query = `{
    getBook(bookID: "${workbookID}"){
      id,name,description,timestamp,
      userRoles{...ur},
      labels{id,userRoles{...ur}},
      metadata{...rm},
      settings,
      snapshots,
      sheets{
        name, id, timestamp, settings,
        userRoles{...ur},
        subViewsUserRoles{...ur},
        metadata{...rm},
        rows{id, data, metadata{...rm} timestamp},
        columns{id, dataType, name, settings, timestamp},
        views{
          id, name, description, timestamp, security,
          sheetID, bookID, columnsIDs, filter, settings,
          userRoles{...ur},
          publish{...pb},
          metadata{...rm}
        },
        subscribeRows,
        publish{...pb},
      }
    }
  }
  fragment ur on ${UserRole}
  fragment pb on ${Publish}
  fragment rm on ${ResourceMetadata}
  `;
  return query;
}