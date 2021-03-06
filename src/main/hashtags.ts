import Datastore from 'nedb'
import LocalTag from '~/src/types/localTag'

export default class Hashtags {
  private db: Datastore

  constructor (db: Datastore) {
    this.db = db
    this.db.ensureIndex({ fieldName: 'tagName', unique: true }, (_) => {})
  }

  listTags (): Promise<Array<LocalTag>> {
    return new Promise((resolve, reject) => {
      this.db.find<LocalTag>({}, (err, docs) => {
        if (err) return reject(err)
        resolve(docs)
      })
    })
  }

  insertTag (tag: string): Promise<LocalTag> {
    return new Promise((resolve, reject) => {
      this.db.insert({ tagName: tag }, (err, doc) => {
        if (err) return reject(err)
        resolve(doc)
      })
    })
  }

  removeTag (localTag: LocalTag): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.remove(
        {
          tagName: localTag.tagName
        },
        { multi: true },
        (err, numRemoved) => {
          if (err) return reject(err)
          resolve(numRemoved)
        }
      )
    })
  }
}
