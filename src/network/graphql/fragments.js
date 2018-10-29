export const HistoryItem = 'HistoryItem {dateTime,actionType,author}';

export const Workbook = `Book {
  id, name, description, timestamp, settings,
  labels { id, name },
  metadataHistory{
    historyData{
      author,
      dateTime,
      actionType
    },
    metadata{
      id,
      name,
      description
    }
  }
}`;

export const View = `View {
  id, name, description, timestamp, security, metadata{createdBy},
  sheetID, bookID, columnsIDs, filter,
  rows {id, timestamp},
  settings
}`;

export const UserRole = `UserRole {
  userID
  role {
    id
    permissions
  }
  userInfo
}`;

export const Publish = `Publish {
  id, bookID, sheetID, targetID
  protection {
    captcha
    password {
      enable
      password
    }
  }
  submission {
    enable
    maxium
    range { enable, start, end }
    daily{
      enable
      ranges{ start, end }
    }
  }
  submitterAuthority {
    submitter
    frequency {
      type
      identifier
    }
  }
  customSettings
}`;

export const ResourceMetadata = `ResourceMetadata {
  created
  createdBy
  modified
  modifiedBy
  commentCount
}`;
